import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const expectedRole = route.data['expectedRole'];
  const userRole = authService.getUserRole();

  // Redirect to login if not logged in
  if (!authService.isLoggedIn()) {
    router.navigate(['/login']);
    return false;
  }

  // If no role restriction, allow access
  if (!expectedRole) {
    return true;
  }

  // Support single role or array of roles
  if (Array.isArray(expectedRole)) {
    if (expectedRole.includes(userRole)) {
      return true;
    }
  } else {
    if (userRole === expectedRole) {
      return true;
    }
  }

  // Redirect to appropriate dashboard if wrong role
  if (userRole === 'AGENT') {
    router.navigate(['/agent-dashboard']);
  } else {
    router.navigate(['/properties']);
  }
  
  return false;
};
