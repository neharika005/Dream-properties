import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

import { filter } from 'rxjs/operators';
import { HeaderComponent } from './layout/header/header.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'real-estate-frontend';

  constructor(private router: Router) {}

  isAuthPage(): boolean {
    const authRoutes = ['/login', '/signup'];
    return authRoutes.includes(this.router.url);
  }
}
