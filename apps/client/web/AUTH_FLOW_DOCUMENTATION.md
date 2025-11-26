# Authentication Flow Documentation

This document describes the complete authentication flow implementation for the HireIQ Next.js application.

## Architecture Overview

The authentication system is built using:
- **Next.js 14+** with App Router
- **React Context API** for state management
- **Cookie-based authentication** (httpOnly cookies for security)
- **JWT tokens** (access token + refresh token)

## Directory Structure

```
apps/client/web/src/
├── shared/
│   ├── types/
│   │   └── auth.types.ts          # TypeScript types & interfaces
│   ├── lib/
│   │   └── api-client.ts          # HTTP client utility
│   ├── services/
│   │   └── auth.service.ts        # Auth API methods
│   ├── context/
│   │   └── auth-context.tsx       # Auth context provider
│   ├── hooks/
│   │   └── useRequireAuth.ts      # Auth protection hook
│   └── components/
│       └── ProtectedRoute.tsx     # Protected route wrapper
└── app/
    ├── login/
    │   └── page.tsx               # Login page
    ├── register/
    │   └── page.tsx               # Registration page
    ├── dashboard/
    │   └── page.tsx               # Protected dashboard
    ├── layout.tsx                 # Root layout with AuthProvider
    └── page.tsx                   # Home/landing page
```

## Backend API Endpoints

The application connects to the following backend endpoints:

### Authentication Endpoints
- `POST /api/v1/user/register` - Register new user
- `POST /api/v1/user/login` - Login user
- `POST /api/v1/user/logout` - Logout user (requires auth)
- `POST /api/v1/user/refresh-token` - Refresh access token
- `GET /api/v1/user/profile` - Get user profile (requires auth)
- `POST /api/v1/user/change-password` - Change password (requires auth)
- `POST /api/v1/user/update-profile` - Update profile (requires auth)
- `POST /api/v1/user/profile-image` - Update profile image (requires auth)

## Key Components

### 1. Auth Types (`auth.types.ts`)

Defines TypeScript interfaces for:
- `User` - User object structure
- `Role` - Enum for EMPLOYEE/RECRUITER
- `LoginDto` - Login request payload
- `RegisterDto` - Registration request payload
- `AuthResponse` - Authentication response structure
- `ApiError` - Error response structure

### 2. API Client (`api-client.ts`)

A generic HTTP client that:
- Handles JSON and FormData requests
- Automatically includes credentials (cookies)
- Provides GET, POST, PUT, DELETE methods
- Centralized error handling

Configuration:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
```

### 3. Auth Service (`auth.service.ts`)

Provides methods for all auth-related API calls:
- `register()` - Register new user with optional profile image
- `login()` - Authenticate user
- `logout()` - End user session
- `getProfile()` - Fetch current user data
- `refreshToken()` - Refresh access token
- `changePassword()` - Update user password
- `updateProfile()` - Update user information
- `updateProfileImage()` - Upload new profile picture

### 4. Auth Context (`auth-context.tsx`)

React Context that manages global auth state:

**State:**
- `user` - Current user object or null
- `loading` - Loading state for async operations
- `error` - Error message if any

**Methods:**
- `login(data)` - Login and redirect to dashboard
- `register(data)` - Register and auto-login
- `logout()` - Logout and redirect to login page
- `clearError()` - Clear error message

**Features:**
- Automatically checks auth status on mount
- Persists auth state across page refreshes
- Handles automatic redirects after auth actions

### 5. Protected Route Components

Two ways to protect routes:

**Option A: Hook-based** (`useRequireAuth.ts`)
```typescript
const { user, loading } = useRequireAuth('/login');
```

**Option B: Component wrapper** (`ProtectedRoute.tsx`)
```typescript
<ProtectedRoute redirectTo="/login">
  <YourProtectedContent />
</ProtectedRoute>
```

## Page Implementations

### Home Page (`/`)
- Landing page with hero section
- CTA buttons for Sign In / Get Started
- Feature highlights
- Auto-redirects to dashboard if already logged in

### Login Page (`/login`)
- Email and password form
- Show/hide password toggle
- Loading states
- Error handling
- Links to registration and forgot password
- Redirects to dashboard on success

### Register Page (`/register`)
- Multi-field registration form:
  - Name, Email, Password, Confirm Password
  - Role selection (Employee/Recruiter)
  - Company name (for recruiters)
  - Optional profile image upload
- Client-side validation
- Show/hide password toggles
- Error handling
- Auto-login after successful registration

### Dashboard Page (`/dashboard`)
- Protected route example
- Displays user information
- Header with user profile and logout button
- Account details card

## Authentication Flow

### Registration Flow
1. User fills registration form
2. Frontend validates input (password match, length, etc.)
3. FormData created (includes optional profile image)
4. POST to `/api/v1/user/register`
5. Backend creates user account
6. Frontend automatically logs in user
7. Redirect to dashboard

### Login Flow
1. User enters email and password
2. POST to `/api/v1/user/login`
3. Backend validates credentials
4. Backend returns tokens + user data
5. Tokens stored in httpOnly cookies
6. User object stored in context state
7. Redirect to dashboard

### Protected Page Access
1. User navigates to protected page
2. `useAuth()` hook checks for user in context
3. If no user, redirect to login
4. If user exists, render protected content

### Session Persistence
1. On app load, `AuthProvider` calls `getProfile()`
2. Backend validates access token from cookie
3. If valid, user data returned and stored in state
4. If invalid, user remains null (logged out state)

### Token Refresh
- Access token expires in 15 minutes
- Refresh token expires in 7 days
- Call `refreshToken()` to get new access token
- Implementation can be added to API client interceptor

### Logout Flow
1. User clicks logout button
2. POST to `/api/v1/user/logout`
3. Backend clears refresh token in database
4. Backend clears cookies
5. Frontend clears user state
6. Redirect to login page

## Environment Configuration

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

For production:
```env
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Security Features

1. **httpOnly Cookies** - Tokens not accessible via JavaScript
2. **Secure Cookies** - HTTPS-only in production
3. **SameSite Strict** - CSRF protection
4. **Password Validation** - Minimum length requirements
5. **Credential Includes** - Cookies sent with every request
6. **Auto Token Refresh** - Seamless session extension

## User Roles

The system supports two roles:

### EMPLOYEE (Job Seeker)
- Can search and apply for jobs
- Manage personal profile
- View application status

### RECRUITER
- Associated with a company
- Can post job listings
- View and manage candidates
- Company name required during registration

## Styling

- **Tailwind CSS** for all styling
- **Dark mode support** built-in
- **Mobile responsive** by default
- **Consistent color scheme** using zinc palette
- **Smooth animations** for loading states

## Error Handling

Errors are handled at multiple levels:

1. **Client-side validation** - Form field validation
2. **API Client** - HTTP error responses
3. **Context State** - Error messages in state
4. **UI Display** - Error alerts in forms

Error messages are:
- User-friendly
- Displayed prominently
- Dismissible when user starts typing
- Specific to the error type

## Best Practices Implemented

1. ✅ Separation of concerns (types, services, context)
2. ✅ TypeScript for type safety
3. ✅ Reusable components and hooks
4. ✅ Consistent error handling
5. ✅ Loading states for async operations
6. ✅ Form validation
7. ✅ Secure token storage
8. ✅ Mobile-first responsive design
9. ✅ Dark mode support
10. ✅ Accessibility considerations

## Usage Examples

### Using Auth in a Component
```typescript
'use client';

import { useAuth } from '@/shared/context/auth-context';

export default function MyComponent() {
  const { user, loading, logout } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting a Page
```typescript
'use client';

import { useRequireAuth } from '@/shared/hooks/useRequireAuth';

export default function ProtectedPage() {
  const { user, loading } = useRequireAuth();

  if (loading) return <div>Loading...</div>;

  return <div>Protected content for {user?.name}</div>;
}
```

### Making Authenticated API Calls
```typescript
import { authService } from '@/shared/services/auth.service';

// Get profile
const { data: user } = await authService.getProfile();

// Update profile
await authService.updateProfile({
  name: 'New Name',
  bio: 'New bio'
});

// Change password
await authService.changePassword('oldPass', 'newPass');
```

## Future Enhancements

Potential improvements:
- [ ] Email verification
- [ ] Password reset flow
- [ ] Social auth (Google, GitHub, etc.)
- [ ] Two-factor authentication
- [ ] Remember me functionality
- [ ] Session management (view active sessions)
- [ ] Account deletion
- [ ] Profile completion progress
- [ ] Role-based route protection
- [ ] Automatic token refresh interceptor

## Troubleshooting

### Common Issues

**"Invalid credentials" on login**
- Check email/password are correct
- Verify backend API is running
- Check CORS configuration

**Redirected to login immediately**
- Check if access token is being sent in cookies
- Verify `credentials: 'include'` in API client
- Check backend cookie settings

**"User not found" after refresh**
- Access token may have expired
- Implement automatic token refresh
- Check cookie expiration settings

**Profile image upload fails**
- Verify file size limits
- Check accepted file types
- Ensure FormData is properly constructed

## Testing

To test the auth flow:

1. **Start backend server** (should be running on port 3001)
2. **Start Next.js dev server**:
   ```bash
   cd apps/client/web
   npm run dev
   ```
3. **Test registration**:
   - Go to `/register`
   - Fill form with valid data
   - Should redirect to `/dashboard`
4. **Test login**:
   - Logout from dashboard
   - Go to `/login`
   - Enter credentials
   - Should redirect to `/dashboard`
5. **Test protected routes**:
   - Navigate to `/dashboard` without auth
   - Should redirect to `/login`
6. **Test persistence**:
   - Login and refresh page
   - Should remain logged in

## Support

For issues or questions:
- Check this documentation
- Review backend API documentation
- Check browser console for errors
- Verify environment variables
- Ensure backend is running and accessible

