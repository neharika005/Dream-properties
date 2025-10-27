import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Property } from '../../models/property.model';
import { Inquiry } from '../../models/inquiry.model';
import { PropertyService } from '../../services/property.service';
import { InquiryService } from '../../services/inquiry.service';
import { getImageUrl } from '../../utils/img-utils';
import { AuthService } from '../../services/auth.service';


import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-agent-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './agent.component.html',
  styleUrls: ['./agent.component.scss']
})
export class AgentDashboardComponent implements OnInit {
  activeTab: 'listings' | 'inquiries' = 'listings';

  myListings: Property[] = [];
  inquiries: Inquiry[] = [];

  isLoadingListings = true;
  isLoadingInquiries = true;

  constructor(
    private propertyService: PropertyService,
    private authService: AuthService,
    private inquiryService: InquiryService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadMyListings();
    this.loadInquiries();
  }

  getAgentId(): number | null {
    return this.authService.getUserId();
  }

  loadMyListings(): void {
    const agentId = this.getAgentId();
    if (!agentId) {
      this.isLoadingListings = false;
      this.myListings = [];
      return;
    }
    this.propertyService.getPropertiesByAgentId(agentId).subscribe({
      next: (data: Property[]) => {
        this.myListings = data;
        this.isLoadingListings = false;
      },
      error: (err: any) => {
        console.error('Error loading listings:', err);
        this.isLoadingListings = false;
      }
    });
  }

  loadInquiries(): void {
    const agentId = this.getAgentId();
    if (!agentId) {
      this.isLoadingInquiries = false;
      this.inquiries = [];
      return;
    }
    this.inquiryService.getInquiriesForAgent(agentId).subscribe({
      next: (data: Inquiry[]) => {
        this.inquiries = data;
        this.isLoadingInquiries = false;
      },
      error: (err: any) => {
        console.error('Error loading inquiries:', err);
        this.isLoadingInquiries = false;
      }
    });
  }

  addNewProperty(): void {
    this.router.navigate(['/agent/property/add']);
  }

  editProperty(propertyId: number): void {
    this.router.navigate(['/agent/property/edit', propertyId]);
  }

 
    
  deleteProperty(propertyId: number): void {
  // Directly delete without confirm popup
  this.propertyService.deleteProperty(propertyId).subscribe({
    next: () => {
      this.myListings = this.myListings.filter(p => p.id !== propertyId);
      this.snackBar.open('Property deleted successfully', 'Close', { duration: 3000 });
    },
    error: (err: any) => {
      if (err.status === 404) {
        this.myListings = this.myListings.filter(p => p.id !== propertyId);
        this.snackBar.open('Property already deleted', 'Close', { duration: 3000 });
      } else {
        this.snackBar.open('failed to delete', 'Close', { duration: 3000 });
      }
    }
  });
}

  viewDetails(propertyId: number): void {
    this.router.navigate(['/property', propertyId]);
  }

  markAsResponded(inquiryId: number): void {
    this.inquiryService.updateInquiryStatus(inquiryId, 'RESOLVED') // or your enum value
      .subscribe({
        next: (updatedInquiry: Inquiry) => {
          const inquiry = this.inquiries.find(i => i.id === inquiryId);
          if (inquiry) {
            inquiry.status = 'RESOLVED';
          }
          this.snackBar.open('Inquiry marked as resolved', 'Close', { duration: 3000 });
        },
        error: (err: any) => {
          console.error('Error updating inquiry:', err);
          this.snackBar.open('Failed to update inquiry', 'Close', { duration: 3000 });
        }
      });
  }

  getStatusClass(status?: string): string {
    if (!status) return 'pending';
    const normalized = status.toLowerCase();
    if (normalized.includes('respond')) return 'responded';
    return 'pending';
  }

  getFirstImageUrl(property: Property): string {
    if (property.images && property.images.length > 0) {
      return getImageUrl(property.images[0].imageUrl);
    }
    return 'assets/placeholder.jpg';
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/placeholder.jpg';
  }
}
