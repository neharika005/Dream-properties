import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Inquiry } from '../models/inquiry.model';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class InquiryService {
  private baseUrl = environment.apiUrl + '/inquiries';

  constructor(private http: HttpClient) {}

  // Send a new inquiry
  sendInquiry(inquiry: Inquiry): Observable<Inquiry> {
    return this.http.post<Inquiry>(this.baseUrl, inquiry);
  }

  // Get all inquiries by buyer ID
  getInquiriesByBuyer(buyerId: number): Observable<Inquiry[]> {
    return this.http.get<Inquiry[]>(`${this.baseUrl}/buyer/${buyerId}`);
  }

  // Get all inquiries for agent's properties
  getInquiriesForAgent(agentId: number): Observable<Inquiry[]> {
    return this.http.get<Inquiry[]>(`${this.baseUrl}/agent/${agentId}`);
  }

  // Update inquiry status
  updateInquiryStatus(inquiryId: number, status: string): Observable<Inquiry> {
    return this.http.patch<Inquiry>(
      `${this.baseUrl}/${inquiryId}/status?status=${status}`,
      {}
    );
  }

  // Get all inquiries
  getInquiries(): Observable<Inquiry[]> {
    return this.http.get<Inquiry[]>(this.baseUrl);
  }
}
