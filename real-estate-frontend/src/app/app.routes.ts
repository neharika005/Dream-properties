import { Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { SignupComponent } from "./auth/signup/signup.component";
import { PropertyDetailsComponent } from "./components/listing/property-detail/property-detail.component";
import { PropertyFormComponent } from "./components/listing/property-form/property-form.component";
import { PropertyListComponent } from "./components/listing/property-list/property-list.component";
import { AgentDashboardComponent } from "./dashboard/agent/agent.component";
import { BuyerDashboardComponent } from "./dashboard/buyer/buyer.component";
import { authGuard } from "./gaurds/auth.gaurd";
import { roleGuard } from "./gaurds/role.gaurd";
import { AdminDashboardComponent } from "./dashboard/admin/admin.component";

export const routes: Routes = [
  // Default route - redirect to login
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  
  // Public routes (no authentication required)
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  
  // Property browsing (public - anyone can view)
  { path: 'properties', component: PropertyListComponent },
  { 
    path: 'property/:id', 
    component: PropertyDetailsComponent 
  },
  
  // Buyer routes (authenticated buyers only)
  { 
    path: 'dashboard', 
    component: BuyerDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'BUYER' }
  },
  { 
    path: 'favorites', 
    component: BuyerDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'BUYER' }
  },
  { 
    path: 'inquiries', 
    component: BuyerDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'BUYER' }
  },
  
  // Agent routes (authenticated agents only)
  { 
    path: 'agent-dashboard', 
    component: AgentDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'AGENT'  }
  },
  { 
    path: 'agent/property/add', 
    component: PropertyFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'AGENT' }
  },
  { 
    path: 'agent/property/edit/:id', 
    component: PropertyFormComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'AGENT' }
  },
  
  {
    path: 'admin-dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard],
    data: { expectedRole: 'ADMIN' }
  },
  // Catch-all route - redirect to login
  { path: '**', redirectTo: '/login' }
];
