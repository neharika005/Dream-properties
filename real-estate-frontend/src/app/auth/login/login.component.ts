import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  error = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

 onSubmit(): void {
  if (!this.loginForm.valid) {
    this.error = 'Please fill in all fields';
    return;
  }

  this.isLoading = true;
  this.error = '';

  const { email, password } = this.loginForm.value;

  this.authService.login(email, password).subscribe({
    next: () => {
      this.isLoading = false;

      // Get user role from AuthService
      const userRole = this.authService.getUserRole();

      // Navigate based on role
      if (userRole === 'AGENT') {
        this.router.navigate(['/agent-dashboard']);
      } else {
        this.router.navigate(['/properties']);
      }
    },
    error: (err) => {
      console.error('Login error:', err);
      this.error = 'Invalid email or password';
      this.isLoading = false;
    }
  });
}


}
