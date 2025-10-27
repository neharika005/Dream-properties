import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  error = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar // Inject MatSnackBar
  ) {
    this.signupForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      role: ['BUYER', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (!this.signupForm.valid) {
      this.snackBar.open('Please fill in all fields correctly', 'Close', {
        duration: 3000,
        panelClass: ['snack-error']
      });
      return;
    }

    this.isLoading = true;
    this.error = '';

    const roleId = this.signupForm.value.role === 'BUYER' ? 3 : 2;
    const signupData = {
      name: this.signupForm.value.name,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password
    };

    this.http.post(
      `http://localhost:8080/api/auth/signup?roleId=${roleId}`,
      signupData,
      { headers: { 'Content-Type': 'application/json' }, responseType: 'text' }
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Signup successful! Please login.', 'Close', {
          duration: 3000,
          panelClass: ['snack-success']
        });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open(
          err?.error?.message || 'Signup failed. Email may already exist.', 
          'Close', 
          { duration: 3000, panelClass: ['snack-error'] }
        );
      }
    });
  }
}
