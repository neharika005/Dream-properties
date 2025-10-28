import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
  id: number;
  name: string;
  email: string;
  approved: boolean;
  role?: string;   // role may be optional if not sent by backend for admin approval
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) {}

  getAllAgents(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/agents`);
  }

  approveAgent(agentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/approve/${agentId}`, {});
  }

  disapproveAgent(agentId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/disapprove/${agentId}`, {});
  }
}
