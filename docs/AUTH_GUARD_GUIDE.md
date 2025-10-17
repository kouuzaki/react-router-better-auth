# Authentication Guard System

## Overview

This project uses a **Context-based authentication guard system** with TanStack Query for real-time session management. The system provides:

- ✅ **AuthContext** - Global authentication state
- ✅ **AuthGuard** - Protect routes requiring authentication
- ✅ **GuestGuard** - Redirect authenticated users from auth pages
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Flexible** - Optional redirects, custom loading states

## Architecture

```
app/
├── lib/
│   └── auth-context.tsx         # AuthProvider & useAuthContext hook
├── components/
│   └── auth/
│       ├── auth-guard.tsx       # AuthGuard & GuestGuard components
│       └── index.ts             # Barrel exports
└── root.tsx                     # App wrapped with AuthProvider
```

## Core Components

### 1. AuthProvider (`app/lib/auth-context.tsx`)

Provides global authentication state using TanStack Query's `useSession()`.

**Features**:
- Automatic session checking
- Real-time authentication state
- Error handling
- Loading states

**Usage in `root.tsx`**:
```tsx
import { AuthProvider } from "~/lib/auth-context";

<QueryProvider>
  <AuthProvider>
    {children}
  </AuthProvider>
</QueryProvider>
```

**Context Value**:
```typescript
interface AuthContextType {
  session: AuthResponse | null | undefined;
  user: User | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: ErrorResponse | null;
}
```

### 2. useAuthContext Hook

Access authentication state anywhere in the app.

**Usage**:
```tsx
import { useAuthContext } from "~/lib/auth-context";

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return <div>Loading...</div>;
  
  if (!isAuthenticated) return <div>Please log in</div>;

  return <div>Welcome, {user?.name}!</div>;
}
```

**Returns**:
- `session` - Full session data (user + session)
- `user` - Current user object
- `isAuthenticated` - Boolean flag
- `isLoading` - Loading state
- `error` - Error if session check failed

### 3. AuthGuard Component

Protects routes that require authentication.

**Basic Usage**:
```tsx
import { AuthGuard } from "~/components/auth";

// Redirect to login if not authenticated (default behavior)
export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}
```

**Props**:
```typescript
interface AuthGuardOptions {
  redirectToLogin?: boolean;      // Default: true
  redirectPath?: string;          // Default: "/auth/login"
  loadingComponent?: ReactNode;   // Custom loading UI
  allowUnauthenticated?: boolean; // Default: false
}
```

**Examples**:

#### Example 1: Standard Protected Route (Dashboard)
```tsx
// app/routes/dashboard/layout.tsx
import { AuthGuard } from "~/components/auth";

export default function DashboardLayout() {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <Outlet />
      </div>
    </AuthGuard>
  );
}
```
- ✅ Redirects to `/auth/login` if not authenticated
- ✅ Shows loading spinner while checking session
- ✅ Stores original URL in `?redirectTo` param

#### Example 2: Optional Auth (Home Page)
```tsx
// app/routes/home.tsx
import { AuthGuard } from "~/components/auth";

export default function Home() {
  const { isAuthenticated, user } = useAuthContext();

  return (
    <AuthGuard redirectToLogin={false}>
      <div>
        {isAuthenticated ? (
          <p>Welcome back, {user?.name}!</p>
        ) : (
          <p>Welcome! Please log in.</p>
        )}
      </div>
    </AuthGuard>
  );
}
```
- ✅ No redirect if not authenticated
- ✅ Can show different content based on auth state
- ✅ Still provides auth context

#### Example 3: Allow Unauthenticated Access
```tsx
<AuthGuard allowUnauthenticated={true}>
  <HomePage />
</AuthGuard>
```
- ✅ Always shows children
- ✅ Provides auth context
- ✅ No redirects

#### Example 4: Custom Redirect Path
```tsx
<AuthGuard redirectPath="/auth/sign-in">
  <Dashboard />
</AuthGuard>
```
- ✅ Redirects to custom path instead of default `/auth/login`

#### Example 5: Custom Loading Component
```tsx
<AuthGuard
  loadingComponent={
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <Spinner className="h-12 w-12 mx-auto" />
        <p className="mt-4">Checking authentication...</p>
      </div>
    </div>
  }
>
  <Dashboard />
</AuthGuard>
```

### 4. GuestGuard Component

Redirects authenticated users away from auth pages.

**Basic Usage**:
```tsx
import { GuestGuard } from "~/components/auth";

// Redirect to dashboard if already logged in
export default function AuthLayout() {
  return (
    <GuestGuard>
      <Outlet /> {/* Login, Register pages */}
    </GuestGuard>
  );
}
```

**Props**:
```typescript
interface GuestGuardProps {
  redirectPath?: string;        // Default: "/dashboard"
  loadingComponent?: ReactNode; // Custom loading UI
}
```

**Examples**:

#### Example 1: Auth Layout (Login/Register)
```tsx
// app/routes/auth/layout.tsx
import { GuestGuard } from "~/components/auth";

export default function AuthLayout() {
  return (
    <GuestGuard redirectPath="/dashboard">
      <Outlet />
    </GuestGuard>
  );
}
```
- ✅ Redirects to `/dashboard` if already logged in
- ✅ Preserves `?redirectTo` param for post-login navigation

#### Example 2: Custom Redirect
```tsx
<GuestGuard redirectPath="/profile">
  <LoginPage />
</GuestGuard>
```

## Redirect Flow

### Protected Route → Login → Back to Original Route

1. **User visits protected route**: `/dashboard/settings`
2. **Not authenticated**: Redirected to `/auth/login?redirectTo=/dashboard/settings`
3. **User logs in**: Redirected to `/dashboard/settings` (from `redirectTo` param)

**Implementation**:
```tsx
// AuthGuard stores original path
const currentPath = window.location.pathname;
searchParams.set("redirectTo", currentPath);

// After login, redirect to stored path
const redirectTo = searchParams.get("redirectTo");
navigate(redirectTo || "/dashboard");
```

### Authenticated User → Auth Page → Dashboard

1. **Logged-in user visits**: `/auth/login`
2. **Already authenticated**: Redirected to `/dashboard`
3. **Or**: Redirected to `?redirectTo` param if present

## Complete Implementation Example

### Project Structure

```
app/
├── root.tsx                     # Wrapped with AuthProvider
├── lib/
│   └── auth-context.tsx         # AuthProvider & useAuthContext
├── components/
│   └── auth/
│       └── auth-guard.tsx       # AuthGuard & GuestGuard
├── routes/
│   ├── home.tsx                 # Public (optional auth)
│   ├── auth/
│   │   ├── layout.tsx           # GuestGuard wrapper
│   │   ├── login.tsx            # Login page
│   │   └── register.tsx         # Register page
│   └── dashboard/
│       ├── layout.tsx           # AuthGuard wrapper
│       ├── dashboard.tsx        # Dashboard page
│       └── settings.tsx         # Settings page
```

### 1. Root Setup (`app/root.tsx`)

```tsx
import { QueryProvider } from "~/lib/query-provider";
import { AuthProvider } from "~/lib/auth-context";

export function Layout({ children }) {
  return (
    <html>
      <body>
        <QueryProvider>
          <AuthProvider>
            <ThemeProvider>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
```

### 2. Public Route with Optional Auth (`app/routes/home.tsx`)

```tsx
import { AuthGuard } from "~/components/auth";
import { useAuthContext } from "~/lib/auth-context";

export default function Home() {
  const { isAuthenticated, user } = useAuthContext();

  return (
    <AuthGuard redirectToLogin={false}>
      <div>
        <h1>Welcome to Our App</h1>
        {isAuthenticated ? (
          <div>
            <p>Hello, {user?.name}!</p>
            <Link to="/dashboard">Go to Dashboard</Link>
          </div>
        ) : (
          <div>
            <Link to="/auth/login">Login</Link>
            <Link to="/auth/register">Register</Link>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
```

### 3. Auth Layout (`app/routes/auth/layout.tsx`)

```tsx
import { GuestGuard } from "~/components/auth";
import { Outlet } from "react-router";

export default function AuthLayout() {
  return (
    <GuestGuard redirectPath="/dashboard">
      <div className="min-h-screen flex items-center justify-center">
        <Outlet />
      </div>
    </GuestGuard>
  );
}
```

### 4. Dashboard Layout (`app/routes/dashboard/layout.tsx`)

```tsx
import { AuthGuard } from "~/components/auth";
import { Outlet } from "react-router";

export default function DashboardLayout() {
  return (
    <AuthGuard>
      <div className="min-h-screen">
        <nav>Dashboard Navigation</nav>
        <main>
          <Outlet />
        </main>
      </div>
    </AuthGuard>
  );
}
```

### 5. Using Auth Context in Components

```tsx
import { useAuthContext } from "~/lib/auth-context";
import { useSignOut } from "~/features/auth/queries/auth-queries";

export function UserMenu() {
  const { user, isAuthenticated } = useAuthContext();
  const signOutMutation = useSignOut();

  if (!isAuthenticated) return null;

  const handleSignOut = async () => {
    await signOutMutation.mutateAsync();
    toast.success("Signed out successfully!");
  };

  return (
    <div>
      <p>{user?.email}</p>
      <button onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}
```

## Loading States

### Default Loading Component

```tsx
<div className="flex items-center justify-center min-h-screen">
  <div className="flex flex-col items-center gap-4">
    <Spinner className="h-8 w-8" />
    <p className="text-sm text-muted-foreground">Loading...</p>
  </div>
</div>
```

### Custom Loading Component

```tsx
<AuthGuard
  loadingComponent={
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto" />
        <h2 className="mt-4 text-xl font-semibold">Loading your workspace...</h2>
        <p className="text-sm text-muted-foreground">This won't take long</p>
      </div>
    </div>
  }
>
  <Dashboard />
</AuthGuard>
```

## Best Practices

### 1. Use Layout Guards

Apply guards at layout level, not individual pages:

✅ **Good**:
```tsx
// app/routes/dashboard/layout.tsx
<AuthGuard>
  <Outlet /> {/* All child routes protected */}
</AuthGuard>
```

❌ **Bad**:
```tsx
// Repeating guard on every page
// app/routes/dashboard/index.tsx
<AuthGuard><Dashboard /></AuthGuard>

// app/routes/dashboard/settings.tsx
<AuthGuard><Settings /></AuthGuard>
```

### 2. Separate Public and Protected Routes

```
routes/
├── home.tsx              # Public (optional auth)
├── about.tsx             # Public
├── auth/
│   ├── layout.tsx        # GuestGuard
│   └── login.tsx
└── dashboard/
    ├── layout.tsx        # AuthGuard
    └── index.tsx
```

### 3. Use useAuthContext for Conditional Rendering

```tsx
const { isAuthenticated, user } = useAuthContext();

return (
  <div>
    {isAuthenticated ? (
      <UserProfile user={user} />
    ) : (
      <LoginButton />
    )}
  </div>
);
```

### 4. Handle Loading States

Always show feedback during auth checks:

```tsx
const { isLoading, isAuthenticated } = useAuthContext();

if (isLoading) {
  return <LoadingSpinner />;
}

return isAuthenticated ? <Dashboard /> : <LoginPrompt />;
```

## Troubleshooting

### Issue 1: "useAuthContext must be used within AuthProvider"

**Cause**: Component using `useAuthContext()` is outside `<AuthProvider>`

**Solution**: Ensure `root.tsx` wraps app with `<AuthProvider>`

```tsx
<QueryProvider>
  <AuthProvider>
    {children}
  </AuthProvider>
</QueryProvider>
```

### Issue 2: Infinite redirect loop

**Cause**: Guard redirecting to itself

**Solution**: Check redirect paths:
- AuthGuard should redirect to `/auth/login`
- GuestGuard should redirect to `/dashboard`
- Don't apply both guards to same route

### Issue 3: Session not updating after login

**Cause**: TanStack Query cache not invalidated

**Solution**: Mutations already handle this:
```tsx
onSuccess: (data) => {
  queryClient.setQueryData(queryKeys.auth.session(), data);
}
```

### Issue 4: Flash of unauthenticated content

**Cause**: Loading state not properly handled

**Solution**: Show loading component:
```tsx
if (isLoading) {
  return <LoadingComponent />;
}
```

## Advanced Usage

### Custom Auth Logic

```tsx
import { useAuthContext } from "~/lib/auth-context";

function AdminRoute({ children }) {
  const { user, isAuthenticated } = useAuthContext();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}
```

### Role-Based Guards

```tsx
function RoleGuard({ 
  children, 
  requiredRole 
}: { 
  children: ReactNode; 
  requiredRole: string;
}) {
  const { user, isAuthenticated, isLoading } = useAuthContext();

  if (isLoading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  if (user?.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
}

// Usage
<RoleGuard requiredRole="admin">
  <AdminPanel />
</RoleGuard>
```

## Summary

- ✅ **AuthProvider** - Global auth state with TanStack Query
- ✅ **useAuthContext** - Hook to access auth state anywhere
- ✅ **AuthGuard** - Protect routes requiring authentication
- ✅ **GuestGuard** - Redirect authenticated users from auth pages
- ✅ **Flexible** - Optional redirects, custom loading, allow unauthenticated
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Automatic** - Session checking and cache management
- ✅ **Developer-friendly** - Clear API, good defaults, easy to customize

---

**Quick Start**: Wrap layouts with guards, use `useAuthContext()` for conditional rendering, and let the system handle the rest!
