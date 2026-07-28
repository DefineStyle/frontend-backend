import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; // Adjust path if needed
import { map, take } from 'rxjs';

// Existing Auth Guard (Keeps guests out)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        return router.createUrlTree(['/login']);
      }
    })
  );
};

// Existing Guest Guard (Keeps logged-in users out of login page)
export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (!user) {
        return true;
      } else {
        return router.createUrlTree(['/']);
      }
    })
  );
};

// NEW: Role Guard (Protects specific screens based on user roles)
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  // Read the expected roles defined in the route config
  const expectedRoles = route.data['expectedRoles'] as string[];

  return authService.currentUser$.pipe(
    take(1),
    map(user => {
      if (!user) {
        return router.createUrlTree(['/login']);
      }

      // If the route has required roles and the user's role is in that list, let them pass!
      if (expectedRoles && expectedRoles.includes(user.role)) {
        return true;
      }

      // Otherwise, reject access and send them to your Access Denied page
      return router.createUrlTree(['/access-denied']);
    })
  );
};