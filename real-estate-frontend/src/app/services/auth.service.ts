import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';


interface DecodedToken {
  sub: string;
  roles: Array<{ authority: string }>;
  email: string;
  name: string;
  exp: number;
}

interface User {
  id?: number;
  name: string;
  email: string;
  role: 'BUYER' | 'AGENT';
}

interface LoginResponse {
  jwt: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private tokenKey = 'authToken';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response) => {
        this.storeToken(response.jwt);
        const user = this.getUserFromToken();
        if (user) {
          this.currentUserSubject.next(user);
        }
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  signup(data: { username: string; email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, data).pipe(
      catchError((error) => {
        console.error('Signup error:', error);
        return throwError(() => error);
      })
    );
  }

  storeToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  getDecodedToken(): DecodedToken | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  getUserFromToken(): User | null {
    const decoded = this.getDecodedToken();
    if (!decoded) return null;

    const user: User = {
      name: decoded.name || decoded.sub,
      email: decoded.email,
      role: decoded.roles?.[0]?.authority as 'BUYER' | 'AGENT' || 'BUYER'
    };

    sessionStorage.setItem('user', JSON.stringify(user));
    return user;
  }

  private getUserFromStorage(): User | null {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  getUserId(): number | null {
    const decoded = this.getDecodedToken();
    if (!decoded || !decoded.sub) return null;
    const id = Number(decoded.sub);
    return isNaN(id) ? null : id;
  }

  getUserRole(): string | null {
    const user = this.currentUserSubject.value || this.getUserFromStorage();
    return user?.role || null;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return token ? !this.isTokenExpired(token) : false;
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded: any = this.getDecodedToken();
      if (!decoded || !decoded.exp) return true;

      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp < currentTime;
    } catch {
      return true;
    }
  }

  logout(): void {
    sessionStorage.removeItem(this.tokenKey);
    sessionStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }
}
