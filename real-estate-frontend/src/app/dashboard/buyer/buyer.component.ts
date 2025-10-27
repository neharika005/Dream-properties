import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Property } from '../../models/property.model';
import { Inquiry } from '../../models/inquiry.model';
import { FavoriteService } from '../../services/favorite.service';
import { InquiryService } from '../../services/inquiry.service';
import { PropertyCardComponent } from '../../components/listing/property-card/property-card.component';
// Import AuthService if needed to get current user ID
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-buyer-dashboard',
  standalone: true,
  imports: [CommonModule, PropertyCardComponent],
  templateUrl: './buyer.component.html',
  styleUrls: ['./buyer.component.scss']
})
export class BuyerDashboardComponent implements OnInit {
  activeTab: 'favorites' | 'inquiries' = 'favorites';

  favorites: Property[] = [];
  inquiries: Inquiry[] = [];

  favoritesCount = 0;
  inquiriesCount = 0;

  isLoadingFavorites = true;
  isLoadingInquiries = true;

  buyerId: number | null = null; // Add this to store the current buyer's ID

  constructor(
    private favoriteService: FavoriteService,
    private inquiryService: InquiryService,
    private authService: AuthService, // Inject AuthService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buyerId = this.authService.getUserId(); // Get buyerId from auth
    this.loadFavorites();
    this.loadInquiries();
  }

  loadFavorites(): void {
    this.isLoadingFavorites = true;
    this.favoriteService.getFavorites().subscribe({
      next: (data: Property[]) => {
        this.favorites = data;
        this.favoritesCount = data.length;
        this.isLoadingFavorites = false;
      },
      error: (err: any) => {
        console.error('Error loading favorites:', err);
        this.isLoadingFavorites = false;
      }
    });
  }

  loadInquiries(): void {
    if (this.buyerId == null) {
      this.inquiries = [];
      this.inquiriesCount = 0;
      this.isLoadingInquiries = false;
      return;
    }
    this.isLoadingInquiries = true;
    this.inquiryService.getInquiriesByBuyer(this.buyerId).subscribe({
      next: (data: Inquiry[]) => {
        this.inquiries = data;
        this.inquiriesCount = data.length;
        this.isLoadingInquiries = false;
      },
      error: (err: any) => {
        console.error('Error loading inquiries:', err);
        this.isLoadingInquiries = false;
      }
    });
  }

  handleToggleSave(propertyId: number): void {
    const property = this.favorites.find(p => p.id === propertyId);
    if (!property) return;

    this.favoriteService.toggleFavorite(property).subscribe({
      next: (isSaved: boolean) => {
        if (!isSaved) {
          this.favorites = this.favorites.filter(p => p.id !== propertyId);
          this.favoritesCount = this.favorites.length;
        }
      }
    });
  }

  viewDetails(propertyId: number): void {
    this.router.navigate(['/property', propertyId]);
  }

  goToListings(): void {
    this.router.navigate(['/properties']);
  }

  getStatusClass(status?: string): string {
    if (!status) return 'pending';
    const normalized = status.toLowerCase();
    if (normalized.includes('complete')) return 'completed';
    if (normalized.includes('respond')) return 'responded';
    return 'pending';
  }
}
