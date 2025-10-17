# Vite Proxy Setup for API Requests

## Overview

This project uses **Vite's proxy feature** to forward API requests from the frontend to the backend server. This eliminates CORS issues during development and provides a clean API path structure.

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```bash
VITE_BACKEND_BASE_URL=http://localhost:3000
```

This variable is used by Vite's proxy configuration to determine where to forward API requests.

### Vite Config (`vite.config.ts`)

```typescript
import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  // Load environment variables
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
      proxy: {
        '/api': {
          target: env.VITE_BACKEND_BASE_URL || 'http://localhost:3000',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
```

**Configuration Breakdown**:
- **`/api`**: Any request starting with `/api` will be proxied
- **`target`**: Backend server URL (from environment variable)
- **`changeOrigin: true`**: Changes the origin of the host header to the target URL
- **`secure: false`**: Disables SSL certificate verification (useful for local development)

## How It Works

### Request Flow

1. **Frontend makes request**: `axios.post('/api/auth/sign-in/email', data)`
2. **Vite intercepts**: Sees `/api` prefix
3. **Vite proxies**: Forwards to `http://localhost:3000/api/auth/sign-in/email`
4. **Backend responds**: Returns data
5. **Vite forwards**: Sends response back to frontend

### Path Mapping

```
Frontend Request          →  Vite Proxy  →  Backend Request
-----------------------------------------------------------------
/api/auth/sign-in/email   →   Proxy      →  http://localhost:3000/api/auth/sign-in/email
/api/auth/sign-up/email   →   Proxy      →  http://localhost:3000/api/auth/sign-up/email
/api/auth/get-session     →   Proxy      →  http://localhost:3000/api/auth/get-session
```

## Axios Configuration

### Axios Client Setup (`app/lib/axios-client.ts`)

```typescript
export const createAxiosInstance = (config?: AxiosRequestConfig): AxiosInstance => {
  const instance = axios.create({
    baseURL: "/api", // Use Vite proxy - will proxy to VITE_BACKEND_BASE_URL
    timeout: 30000,
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true, // Important for cookies/sessions
    ...config,
  });
  
  // ... interceptors
};
```

**Key Points**:
- `baseURL: "/api"` - All requests are prefixed with `/api`
- `withCredentials: true` - Sends cookies with requests (important for auth)
- Vite proxy handles forwarding to actual backend

### API Endpoints (`app/features/auth/api/auth-api.ts`)

```typescript
const AUTH_ENDPOINTS = {
  SIGN_IN: "/auth/sign-in/email",        // → /api/auth/sign-in/email
  SIGN_UP: "/auth/sign-up/email",        // → /api/auth/sign-up/email
  SIGN_OUT: "/auth/sign-out",            // → /api/auth/sign-out
  SESSION: "/auth/get-session",          // → /api/auth/get-session
  FORGET_PASSWORD: "/auth/forget-password",
  RESET_PASSWORD: "/auth/reset-password",
  SOCIAL_SIGN_IN: (provider: string) => `/auth/sign-in/${provider}`,
} as const;
```

**Final URLs** (after baseURL + proxy):
- `/api` + `/auth/sign-in/email` = `/api/auth/sign-in/email`
- Proxied to: `http://localhost:3000/api/auth/sign-in/email`

## Benefits of Proxy Approach

### 1. **No CORS Issues**
- Frontend and backend appear to be on same origin
- Browser doesn't block requests
- No need for CORS headers during development

### 2. **Clean Code**
- No hardcoded URLs in frontend code
- Easy to change backend location
- Same code works in dev and production

### 3. **Security**
- Backend URL not exposed in frontend bundle
- Can use different backends per environment
- Credentials (cookies) work seamlessly

### 4. **Simplified Development**
- No need to run frontend and backend on different ports
- Single dev server setup
- Hot reload works correctly

## Environment-Specific Configuration

### Development (`.env`)
```bash
VITE_BACKEND_BASE_URL=http://localhost:3000
```

### Staging (`.env.staging`)
```bash
VITE_BACKEND_BASE_URL=https://api-staging.example.com
```

### Production (`.env.production`)
```bash
VITE_BACKEND_BASE_URL=https://api.example.com
```

Or use production server's reverse proxy instead of Vite proxy.

## Production Setup

### Option 1: Reverse Proxy (Recommended)

Use Nginx or similar to proxy `/api` requests:

```nginx
server {
  listen 80;
  server_name example.com;

  # Serve frontend
  location / {
    root /var/www/frontend;
    try_files $uri $uri/ /index.html;
  }

  # Proxy API requests
  location /api {
    proxy_pass http://backend:3000;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

### Option 2: Change Base URL

Update `axios-client.ts` for production:

```typescript
const instance = axios.create({
  baseURL: import.meta.env.PROD 
    ? "https://api.example.com/api" 
    : "/api",
  // ...
});
```

## Debugging

### Check Proxy is Working

1. **Open Browser DevTools** → Network tab
2. **Make a request** (e.g., sign in)
3. **Check request URL**: Should show `/api/auth/sign-in/email`
4. **Check response**: Should come from backend

### Common Issues

#### 1. 404 Not Found
```
POST http://localhost:5173/api/auth/sign-in/email 404 (Not Found)
```

**Causes**:
- Vite proxy not configured
- Backend endpoint doesn't exist
- Wrong API path

**Solutions**:
- Verify `vite.config.ts` has proxy config
- Check backend is running on correct port
- Verify endpoint path matches backend routes

#### 2. CORS Error (Still happening)
```
Access to XMLHttpRequest blocked by CORS policy
```

**Causes**:
- `withCredentials: true` but backend doesn't allow credentials
- Backend CORS config doesn't match frontend origin

**Solutions**:
- Backend should set `Access-Control-Allow-Credentials: true`
- Backend should set correct `Access-Control-Allow-Origin`
- Verify `changeOrigin: true` in Vite proxy

#### 3. Proxy Not Forwarding
```
Request goes to localhost:5173 instead of localhost:3000
```

**Causes**:
- `.env` file not loaded
- Wrong proxy path prefix
- Vite dev server not restarted

**Solutions**:
- Restart Vite dev server: `pnpm run dev`
- Check `.env` file exists and is correct
- Verify request path starts with `/api`

### Enable Proxy Logging

Add to `vite.config.ts` for debugging:

```typescript
server: {
  proxy: {
    '/api': {
      target: env.VITE_BACKEND_BASE_URL || 'http://localhost:3000',
      changeOrigin: true,
      secure: false,
      configure: (proxy, _options) => {
        proxy.on('error', (err, _req, _res) => {
          console.log('proxy error', err);
        });
        proxy.on('proxyReq', (proxyReq, req, _res) => {
          console.log('Sending Request:', req.method, req.url);
        });
        proxy.on('proxyRes', (proxyRes, req, _res) => {
          console.log('Received Response:', proxyRes.statusCode, req.url);
        });
      },
    },
  },
}
```

## Testing the Setup

### 1. Start Backend Server
```bash
# Make sure backend is running on port 3000
cd backend
npm run dev
```

### 2. Start Frontend Dev Server
```bash
# In project root
pnpm run dev
```

### 3. Test API Call
```typescript
// In browser console
fetch('/api/auth/get-session')
  .then(r => r.json())
  .then(data => console.log(data))
  .catch(err => console.error(err));
```

Should see request go to backend and return response.

## Summary

- ✅ **Vite proxy** forwards `/api/*` to backend
- ✅ **Environment variable** `VITE_BACKEND_BASE_URL` sets backend URL
- ✅ **Axios baseURL** set to `/api` (not full backend URL)
- ✅ **No CORS issues** in development
- ✅ **Clean separation** between frontend and backend
- ✅ **Production ready** with reverse proxy or environment configs

---

**Key Takeaway**: Frontend makes requests to `/api/auth/...` which Vite automatically forwards to `http://localhost:3000/api/auth/...` during development.
