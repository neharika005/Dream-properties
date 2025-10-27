import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PropertyImageDto {
  id?: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class PropertyImageService {
  private baseUrl = 'http://localhost:8080/api/property-images';

  constructor(private http: HttpClient) {}

  // Add an image to a property
  addImage(propertyId: number, imageDto: PropertyImageDto): Observable<PropertyImageDto> {
    return this.http.post<PropertyImageDto>(`${this.baseUrl}/property/${propertyId}`, imageDto);
  }

  // Get images by property id
  getImagesByPropertyId(propertyId: number): Observable<PropertyImageDto[]> {
    return this.http.get<PropertyImageDto[]>(`${this.baseUrl}/property/${propertyId}`);
  }

  // Delete image by id (full URL overrides baseUrl)
deleteImage(imageId: number): Observable<void> {
  return this.http.delete<void>(`http://localhost:8080/api/images/${imageId}`);
}


  // Get single image by id
  getImageById(imageId: number): Observable<PropertyImageDto> {
    return this.http.get<PropertyImageDto>(`${this.baseUrl}/${imageId}`);
  }

  // Get images by property title
  getImagesByPropertyTitle(title: string): Observable<PropertyImageDto[]> {
    return this.http.get<PropertyImageDto[]>(`${this.baseUrl}/property/title/${encodeURIComponent(title)}`);
  }
}
