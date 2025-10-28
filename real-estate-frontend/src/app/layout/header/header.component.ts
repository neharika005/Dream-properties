import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentRoute = '';
  showLogout = false;

  constructor(private router: Router, public authService: AuthService) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.url;
      });

    this.currentRoute = this.router.url;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // Role-aware dashboard navigation
  navigateToDashboard(): void {
    const role = this.authService.getUserRole();
    if (role === 'ADMIN' || role === 'AGENT') {
      this.router.navigate(['/agent-dashboard']);
    } else if (role === 'BUYER') {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  isActive(route: string): boolean {
    if (route === '/properties') {
      return this.currentRoute === '/' ||
             this.currentRoute === '/properties' ||
             this.currentRoute.startsWith('/property/');
    }
    if (route === '/dashboard' || route === '/agent-dashboard') {
      return this.currentRoute === '/dashboard' || this.currentRoute === '/agent-dashboard';
    }
    return this.currentRoute.startsWith(route);
  }

  toggleLogout(): void {
    this.showLogout = !this.showLogout;
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}
