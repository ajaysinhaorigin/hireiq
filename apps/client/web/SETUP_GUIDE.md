# Quick Setup Guide - HireIQ Auth Flow

## Prerequisites

1. Backend API running on `http://localhost:3001` (or your configured URL)
2. Node.js and npm installed
3. Next.js workspace set up

## Setup Steps

### 1. Environment Configuration

Create a `.env.local` file in the web app root:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 2. Install Dependencies (if needed)

```bash
cd apps/client/web
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Available Routes

| Route | Description | Protection |
|-------|-------------|------------|
| `/` | Landing page | Public |
| `/login` | Login page | Public (redirects if authenticated) |
| `/register` | Registration page | Public (redirects if authenticated) |
| `/dashboard` | User dashboard | Protected (requires authentication) |

## Testing the Flow

### 1. Test Registration
1. Navigate to `http://localhost:3000/register`
2. Fill in the form:
   - **Name**: Your full name
   - **Email**: Valid email address
   - **Role**: Choose Employee or Recruiter
   - **Company Name**: (Required if Recruiter role selected)
   - **Password**: Minimum 6 characters
   - **Confirm Password**: Must match password
   - **Profile Image**: (Optional) Upload an image
3. Click "Create account"
4. You should be automatically logged in and redirected to `/dashboard`

### 2. Test Login
1. Click logout from dashboard (or navigate to `http://localhost:3000/login`)
2. Enter your email and password
3. Click "Sign in"
4. You should be redirected to `/dashboard`

### 3. Test Protected Routes
1. Logout from dashboard
2. Try to navigate directly to `http://localhost:3000/dashboard`
3. You should be automatically redirected to `/login`

### 4. Test Session Persistence
1. Login to your account
2. Refresh the page
3. You should remain logged in (profile data loaded from backend)

## Features Implemented

✅ **User Registration**
- Multi-role support (Employee/Recruiter)
- Optional profile image upload
- Client-side validation
- Password confirmation

✅ **User Login**
- Email and password authentication
- Show/hide password toggle
- Error handling
- Remember session via cookies

✅ **Protected Routes**
- Automatic redirect if not authenticated
- Session persistence across refreshes
- Loading states

✅ **User Dashboard**
- Display user information
- Profile picture (if uploaded)
- Logout functionality
- Account details

✅ **Landing Page**
- Hero section with CTA
- Feature highlights
- Auto-redirect if already logged in

✅ **Auth Context**
- Global auth state management
- Reusable across components
- Error handling
- Loading states

✅ **Dark Mode Support**
- All pages support dark mode
- Smooth transitions

✅ **Mobile Responsive**
- Works on all screen sizes
- Touch-friendly forms

## API Endpoints Used

The frontend connects to these backend endpoints:

```
POST   /api/v1/user/register        - Create new account
POST   /api/v1/user/login           - Authenticate user
POST   /api/v1/user/logout          - End session
GET    /api/v1/user/profile         - Get current user
POST   /api/v1/user/refresh-token   - Refresh access token
POST   /api/v1/user/change-password - Update password
POST   /api/v1/user/update-profile  - Update user info
POST   /api/v1/user/profile-image   - Update profile picture
```

## File Structure Overview

```
apps/client/web/src/
├── shared/
│   ├── types/auth.types.ts           # TypeScript interfaces
│   ├── lib/api-client.ts             # HTTP client
│   ├── services/auth.service.ts      # Auth API calls
│   ├── context/auth-context.tsx      # Auth state management
│   ├── hooks/useRequireAuth.ts       # Auth protection hook
│   └── components/ProtectedRoute.tsx # Protected route wrapper
└── app/
    ├── page.tsx                      # Landing page
    ├── layout.tsx                    # Root layout (AuthProvider)
    ├── login/page.tsx                # Login page
    ├── register/page.tsx             # Registration page
    └── dashboard/page.tsx            # Dashboard (protected)
```

## Common Issues & Solutions

### Issue: Cannot connect to backend
**Solution**: Verify backend is running and check `NEXT_PUBLIC_API_URL` in `.env.local`

### Issue: CORS errors
**Solution**: Ensure backend has CORS enabled for `http://localhost:3000`

### Issue: Cookies not being set
**Solution**: Check backend cookie settings (`httpOnly`, `sameSite`, `secure`)

### Issue: Session not persisting
**Solution**: Verify `credentials: 'include'` in API client configuration

### Issue: Profile image upload fails
**Solution**: Check file size limits and backend multer configuration

## Next Steps

After successful setup, you can:
1. Add more protected pages
2. Implement password reset flow
3. Add email verification
4. Create role-based route protection
5. Add profile editing functionality
6. Implement token refresh interceptor

## Using Auth in Your Components

### Get current user
```typescript
import { useAuth } from '@/shared/context/auth-context';

function MyComponent() {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not logged in</div>;
  
  return <div>Hello, {user.name}!</div>;
}
```

### Protect a route
```typescript
import { useRequireAuth } from '@/shared/hooks/useRequireAuth';

function ProtectedPage() {
  const { user, loading } = useRequireAuth();
  
  if (loading) return <div>Loading...</div>;
  
  return <div>Protected content</div>;
}
```

### Logout user
```typescript
import { useAuth } from '@/shared/context/auth-context';

function LogoutButton() {
  const { logout } = useAuth();
  
  return <button onClick={logout}>Logout</button>;
}
```

## Support

For detailed documentation, see `AUTH_FLOW_DOCUMENTATION.md`

For issues:
1. Check browser console for errors
2. Verify backend is running
3. Check network tab for API responses
4. Ensure environment variables are set correctly

