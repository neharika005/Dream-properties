import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Property } from '../models/property.model';
import { AuthService } from './auth.service';
import { map, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class FavoriteService {
  private baseUrl = environment.apiUrl + '/favorites';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  // Get all favorite properties for the logged-in buyer
  getFavorites(): Observable<Property[]> {
    const buyerId = this.authService.getUserId();
    if (buyerId == null) {
      return of([]); // Return empty array if no buyerId
    }
    return this.http.get<Property[]>(`${this.baseUrl}/user?buyerId=${buyerId}`);
  }

  // Check if a property is in the buyer's favorites
  isFavorite(propertyId: number): Observable<boolean> {
    return this.getFavorites().pipe(
      map((favorites: Property[]) => favorites.some(f => f.id === propertyId))
    );
  }

  // Toggle favorite (add if not, remove if exists)
  toggleFavorite(property: Property): Observable<boolean> {
    const buyerId = this.authService.getUserId();
    if (buyerId == null) {
      return throwError(() => new Error('User not logged in'));
    }
    return this.isFavorite(property.id).pipe(
      switchMap((isFav) => {
        if (isFav) {
          return this.removeFavorite(property.id, buyerId).pipe(map(() => false));
        } else {
          return this.addFavorite(property.id, buyerId).pipe(map(() => true));
        }
      })
    );
  }

  // Add favorite
  addFavorite(propertyId: number, buyerId: number): Observable<any> {
    return this.http.post(this.baseUrl, { propertyId, buyerId });
  }

  // Remove favorite
  removeFavorite(propertyId: number, buyerId: number): Observable<any> {
    return this.http.request('delete', this.baseUrl, { body: { propertyId, buyerId } });
  }
}
