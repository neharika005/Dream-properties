import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Property } from '../models/property.model';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private baseUrl = environment.apiUrl + '/properties';

  constructor(private http: HttpClient) { }

  // Get all properties
  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.baseUrl);
  }

  // Get property by ID
  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.baseUrl}/${id}`);
  }

  // Get properties by agent ID
  getPropertiesByAgentId(agentId: number): Observable<Property[]> {
    return this.http.get<Property[]>(`${this.baseUrl}?agentId=${agentId}`);
  }

  // Create property
  createProperty(property: Property): Observable<Property> {
    return this.http.post<Property>(this.baseUrl, property);
  }

  // Update property
  updateProperty(id: number, property: Property): Observable<Property> {
    return this.http.put<Property>(`${this.baseUrl}/${id}`, property);
  }

  // Delete property
  deleteProperty(propertyId: number) {
    return this.http.delete(
      `${environment.apiUrl}/properties/${propertyId}`,
      { responseType: 'text' as 'json' }
    );
  }

  // Search properties by title
  searchByTitle(title: string): Observable<Property[]> {
    return this.http.post<Property[]>(`${this.baseUrl}/search`, { title });
  }
}
