import { Routes } from '@angular/router';

import { Layout } from './shared/layout/layout';

import { Login } from './features/auth/login/login';
import { Home } from './features/home/home'; 
import { Dashboard } from './features/dashboard/dashboard';
import { Employees } from './features/employees/employees';
import { Departments } from './features/departments/departments';
import { Positions } from './features/positions/positions';
import { Grades } from './features/grades/grades';
import { Users } from './features/users/users';
import { Profile } from './features/profile/profile'; // 1. Import your Profile Component!
import { AccessDenied } from './features/auth/access-denied/access-denied';

// Import our updated guards
import { authGuard, guestGuard, roleGuard } from './core/guards/auth-guard'; 

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [guestGuard]
  },

  {
    path: '',
    component: Layout,
    canActivate: [authGuard], // Parent layout still requires being logged in
    children: [
      {
        path: '',
        component: Home,
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: Dashboard, // Anyone logged in can view the general dashboard
        canActivate: [roleGuard], // Restrict to Admin & HR only
        data: { expectedRoles: ['ADMIN', 'HR'] }
      },
      {
        path: 'profile',
        component: Profile // 2. Added profile route (Accessible to ALL authenticated roles!)
      },
      {
        path: 'employees',
        component: Employees,
        canActivate: [roleGuard], // Restrict to Admin & HR only
        data: { expectedRoles: ['ADMIN', 'HR'] }
      },
      {
        path: 'departments',
        component: Departments,
        canActivate: [roleGuard], // Restrict to Admin & HR only
        data: { expectedRoles: ['ADMIN', 'HR'] }
      },
      {
        path: 'positions',
        component: Positions,
        canActivate: [roleGuard], // Restrict to Admin & HR only
        data: { expectedRoles: ['ADMIN', 'HR'] }
      },
      {
        path: 'grades',
        component: Grades,
        canActivate: [roleGuard], // Restrict to Admin & HR only
        data: { expectedRoles: ['ADMIN', 'HR'] }
      },
      {
        path: 'users',
        component: Users,
        canActivate: [roleGuard], // Restrict to Admin only
        data: { expectedRoles: ['ADMIN'] }
      }
    ]
  },

  {
    path: 'access-denied',
    component: AccessDenied
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];