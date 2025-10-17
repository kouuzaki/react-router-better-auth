# Architecture Documentation - Feature-Based Structure

## Overview

This project follows a **feature-based architecture** where all related code for a specific feature is co-located in one directory. This approach improves maintainability, scalability, and developer experience.

## Folder Hierarchy

```
app/
├── features/                   # Feature modules (business logic, components, hooks)
│   └── auth/                  # Authentication feature
│       ├── api/               # API service layer (Axios)
│       │   └── auth-api.ts    # Raw API calls
│       ├── components/        # Feature-specific UI components
│       │   ├── LoginForm.tsx
│       │   ├── RegisterForm.tsx
│       │   ├── LoginHeader.tsx
│       │   └── SocialLoginButtons.tsx
│       ├── queries/           # TanStack Query hooks
│       │   └── auth-queries.ts   # useSignIn, useSignUp, etc.
│       ├── routes/           # Feature route handlers
│       │   ├── login.tsx     # Login route logic
│       │   └── register.tsx  # Register route logic
│       ├── schema/           # Validation schemas
│       │   └── auth.schema.ts   # Zod schemas for auth
│       ├── types.ts          # TypeScript type definitions
│       └── index.ts          # Barrel exports for the feature
│
├── routes/                    # Router entry points (thin wrappers)
│   └── auth/
│       ├── layout.tsx        # Auth layout wrapper
│       ├── login.tsx         # Login route wrapper
│       └── register.tsx      # Register route wrapper
│
├── components/               # Shared/global components
│   ├── shared/              # Reusable component variants
│   │   ├── alert-dialog-shared.tsx
│   │   ├── input-otp-shared.tsx
│   │   └── index.ts
│   └── ui/                  # Base UI components (shadcn)
│       ├── button.tsx
│       ├── input.tsx
│       ├── form.tsx
│       └── ...
│
└── lib/                      # Global utilities
    ├── axios-client.ts       # Axios instance with interceptors
    ├── query-client.ts       # TanStack Query client config
    ├── query-provider.tsx    # React Query provider
    ├── auth-client.ts        # Better Auth client (legacy)
    ├── env.ts                # Environment validation (Zod)
    └── utils.ts              # General utilities
```

## Architecture Principles

### 1. Feature-Based Organization

All code related to a specific feature lives in `app/features/{feature-name}/`:

- **API**: Raw API calls using Axios (no React hooks)
- **Queries**: TanStack Query hooks wrapping API calls
- **Components**: Feature-specific UI components
- **Routes**: Route handlers with feature logic
- **Schema**: Validation schemas (Zod)
- **Types**: TypeScript type definitions

### 2. Separation of Concerns

#### Features Layer (`app/features/`)
- Contains complete feature implementation
- Self-contained and reusable
- Handles business logic and state management
- Exports components, hooks, types, and schemas

#### Routes Layer (`app/routes/`)
- Thin wrappers that import from features
- Handles routing configuration
- Manages meta tags, loaders, and actions (React Router specific)
- No business logic

### 3. Component Organization

#### Feature Components (`app/features/{feature}/components/`)
- Specific to the feature
- Can use feature hooks and services
- Example: `LoginForm`, `RegisterForm`

#### Shared Components (`app/components/shared/`)
- Reusable across features
- Variants of base components
- Example: `AlertDialogDestructive`, `InputOTPCompact`

#### Base Components (`app/components/ui/`)
- Core UI primitives (shadcn)
- No business logic
- Example: `Button`, `Input`, `Form`

## Authentication Feature Structure

### API Layer (`api/auth-api.ts`)
Raw API calls using Axios:
- `AuthApiService.signInEmail()`: Login with email/password
- `AuthApiService.signUpEmail()`: User registration
- `AuthApiService.signOut()`: Logout
- `AuthApiService.getSession()`: Fetch current session
- `AuthApiService.signInSocial()`: Social authentication

All methods are static and throw `ApiError` on failure.

### Query Layer (`queries/auth-queries.ts`)
TanStack Query hooks with type-safe error handling:
- `useSession()`: Query hook for session data
- `useSignIn()`: Mutation hook for login
- `useSignUp()`: Mutation hook for registration
- `useSignOut()`: Mutation hook for logout
- `useSocialSignIn()`: Mutation hook for social login
- `useForgetPassword()`: Mutation hook for password reset request
- `useResetPassword()`: Mutation hook for password reset
- `useAuth()`: Combined hook with all operations

All hooks return:
- Loading states (`isPending`, `isLoading`)
- Error states (type-safe `ErrorResponse`)
- Data (type-safe responses)
- Mutation functions (`mutate`, `mutateAsync`)

### Schema Layer (`schema/auth.schema.ts`)
Defines validation rules using Zod:
- `signInEmailSchema`: Email + password validation
- `signUpEmailSchema`: Registration with password confirmation
- `forgetPasswordSchema`: Password reset request
- `resetPasswordSchema`: New password validation

### Type Layer (`types.ts`)
TypeScript interfaces for type safety:
- `User`: User entity from Better Auth
- `Session`: Session data structure
- `AuthResponse`: API response format
- `ErrorResponse`: Error handling format

### Component Layer (`components/`)
UI implementation:
- `LoginForm`: Complete login interface
- `RegisterForm`: Registration form with validation
- `LoginHeader`: Reusable header component
- `SocialLoginButtons`: Social login buttons

### Route Layer (`routes/`)
Feature route handlers:
- `login.tsx`: Renders `LoginForm`
- `register.tsx`: Renders `RegisterForm`

## Import Patterns

### Path Aliases
```typescript
// Use ~/ for app/* imports (configured in tsconfig.json)
import { useAuth } from "~/features/auth";
import { Button } from "~/components/ui/button";
import { env } from "~/lib/env";
```

### Barrel Exports
```typescript
// Feature index.ts exports everything
export { LoginForm, RegisterForm } from "./components";
export { useAuth } from "./hooks";
export * from "./types";
export * from "./schema/auth.schema";

// Clean imports in consuming code
import { useAuth, LoginForm, signInEmailSchema } from "~/features/auth";
```

## Data Flow

```
User Interaction
    ↓
Component (LoginForm.tsx)
    ↓
Query Hook (useSignIn from auth-queries.ts)
    ↓
API Service (AuthApiService.signInEmail)
    ↓
Axios Client (axiosClient.post)
    ↓
Better Auth API
    ↓
Response ← Axios ← API Service ← Query Hook ← Component
    ↓
TanStack Query Cache Update
    ↓
UI Update + Toast Notification
```

## Benefits of This Structure

1. **Co-location**: Related code lives together, easier to find and modify
2. **Reusability**: Features can be extracted or reused in other projects
3. **Scalability**: Add new features without touching existing code
4. **Type Safety**: Full TypeScript support from API to UI
5. **Maintainability**: Clear separation of concerns
6. **Testing**: Each layer can be tested independently
7. **DX**: Barrel exports provide clean import paths
8. **Error Handling**: Type-safe errors throughout the stack
9. **Caching**: Automatic caching and refetching with TanStack Query
10. **DevTools**: Built-in debugging with React Query DevTools

## Adding a New Feature

To add a new feature (e.g., `profile`):

1. Create feature directory: `app/features/profile/`
2. Add subdirectories: `api/`, `queries/`, `components/`, `routes/`, `schema/`
3. Create types: `types.ts`
4. Add barrel exports: `index.ts`
5. Create route wrapper: `app/routes/profile/index.tsx`
6. Add query keys: Update `app/lib/query-client.ts`

Example:

```typescript
// app/lib/query-client.ts
export const queryKeys = {
  auth: { /* ... */ },
  profile: {
    all: ["profile"] as const,
    detail: (id: string) => [...queryKeys.profile.all, "detail", id] as const,
  },
};

// app/features/profile/api/profile-api.ts
export class ProfileApiService {
  static async getProfile(id: string): Promise<Profile> {
    const response = await axiosClient.get<Profile>(`/profiles/${id}`);
    return response.data;
  }
}

// app/features/profile/queries/profile-queries.ts
export function useProfile(id: string) {
  return useQuery<Profile, ErrorResponse>({
    queryKey: queryKeys.profile.detail(id),
    queryFn: async () => {
      try {
        return await ProfileApiService.getProfile(id);
      } catch (error) {
        throw toErrorResponse(error);
      }
    },
  });
}

// app/features/profile/index.ts
export { ProfileForm } from "./components/ProfileForm";
export { useProfile } from "./queries/profile-queries";
export * from "./types";

// app/routes/profile/index.tsx
import { ProfileForm } from "~/features/profile";
export default function Profile() {
  return <ProfileForm />;
}
```

## Best Practices

1. **Keep routes thin**: Only routing logic, delegate to features
2. **Use Zod schemas**: Validate at boundaries (forms, API responses)
3. **Centralize API calls**: Use API service layer with Axios
4. **Wrap API with Query hooks**: Use TanStack Query for state management
5. **Type everything**: Use TypeScript interfaces throughout
6. **Export via index.ts**: Provide clean public API for features
7. **Separate concerns**: API → Queries → Components
8. **Error handling**: Use type-safe ErrorResponse
9. **Cache management**: Use query keys for cache operations
10. **Update cache on mutations**: Keep UI in sync with server state

## Technology Stack

- **Framework**: React Router v7
- **Auth**: Better Auth v1.3.27
- **HTTP Client**: Axios v1.12.2
- **State Management**: TanStack Query v5.90.5
- **Validation**: Zod v4.1.12
- **Forms**: react-hook-form v7.65.0
- **UI**: Shadcn UI (Radix primitives)
- **TypeScript**: v5.9.2 (strict mode)
- **Notifications**: Sonner

## Additional Documentation

- **TanStack Query Guide**: See `TANSTACK_QUERY_GUIDE.md` for detailed documentation on:
  - Setting up Axios with interceptors
  - Creating API services
  - Building type-safe query hooks
  - Error handling patterns
  - Cache management
  - Adding new modules
  - Best practices

---

**Note**: This architecture follows React Router v7, Better Auth, and TanStack Query best practices. Each feature is self-contained, type-safe, and can be developed, tested, and maintained independently.
