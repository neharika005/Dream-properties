import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../../../models/property.model';
import { PropertyService } from '../../../services/property.service';
import { FavoriteService } from '../../../services/favorite.service';
import { Inquiry } from '../../../models/inquiry.model';
import { InquiryService } from '../../../services/inquiry.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { DecimalPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { getImageUrl } from '../../../utils/img-utils';
import { AuthService } from '../../../services/auth.service';
import { PropertyImageService } from '../../../services/property-image.service';
import { MatSnackBar } from '@angular/material/snack-bar';

declare var google: any;

interface GalleryImage {
  url: string;
  id: number;
}

@Component({
  selector: 'app-property-details',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe, RouterModule]
})
export class PropertyDetailsComponent implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef;

  property?: Property;
  agent?: User;
  isSaved: boolean = false;
  map?: any;

  contactForm = {
    name: '',
    email: '',
    message: ''
  };

  galleryImages: GalleryImage[] = [];


  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private favoriteService: FavoriteService,
    private inquiryService: InquiryService,
    private userService: UserService,
    private location: Location,
    public authService: AuthService,
    private propertyImageService: PropertyImageService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadProperty(id);
  }

  ngAfterViewInit() {}

  loadProperty(id: number) {
    this.propertyService.getPropertyById(id).subscribe({
      next: (data) => {
        this.property = data;
        if (this.property) {
          // Make galleryImages contain both url and id
          this.galleryImages = (this.property.images ?? []).map(img => ({
            url: getImageUrl(img.imageUrl),
            id: img.id
          }));
          if (this.property.latitude && this.property.longitude) {
            setTimeout(() => this.initMap(), 100);
          }
          this.favoriteService.isFavorite(this.property.id).subscribe((isFav) => (this.isSaved = isFav));
          if (this.property.agentId) {
            this.userService.getUserById(this.property.agentId).subscribe({
              next: (agent) => (this.agent = agent),
              error: (err) => console.error('Error loading agent:', err)
            });
          }
        }
      },
      error: (err) => {
        console.error('Property not found', err);
        this.property = undefined;
      }
    });
  }

  initMap(): void {
    if (!this.property?.latitude || !this.property?.longitude || !this.mapContainer) return;
    const mapOptions = {
      center: { lat: this.property.latitude, lng: this.property.longitude },
      zoom: 15,
      mapTypeId: 'roadmap',
      disableDefaultUI: false,
      zoomControl: true,
      streetViewControl: false,
      fullscreenControl: true
    };
    this.map = new google.maps.Map(this.mapContainer.nativeElement, mapOptions);
    new google.maps.Marker({
      position: { lat: this.property.latitude, lng: this.property.longitude },
      map: this.map,
      title: this.property.title,
      animation: google.maps.Animation.DROP
    });
  }

  goBack() {
    this.location.back();
  }

  onToggleSave() {
    if (!this.property) return;
    this.favoriteService.toggleFavorite(this.property).subscribe(isFav => {
      this.isSaved = isFav;
      this.snackBar.open(isFav ? 'Added to favorites' : 'Removed from favorites', 'Close', { duration: 3000 });
    });
  }

  onSubmit() {
    if (!this.property) return;
    const buyerId = this.authService.getUserId();
    if (!buyerId) {
      this.snackBar.open('You must be logged in to send an inquiry.', 'Close', { duration: 3000 });
      return;
    }

    const inquiry: Inquiry = {
      propertyId: this.property.id,
      buyerId: buyerId,
      name: this.contactForm.name,
      email: this.contactForm.email,
      message: this.contactForm.message,
      propertyTitle: this.property.title,
      agentName: this.agent?.name,
      date: new Date(),
      id: 0,
      status: ''
    };

    this.inquiryService.sendInquiry(inquiry).subscribe({
      next: () => {
        this.snackBar.open('Message sent! The agent will contact you soon.', 'Close', { duration: 3000 });
        this.contactForm = { name: '', email: '', message: '' };
      },
      error: (err) => {
        console.error('Error sending inquiry:', err);
        this.snackBar.open('Failed to send message. Please try again.', 'Close', { duration: 3000 });
      }
    });
  }

  getAgentInitials(): string {
    if (!this.agent?.name) return '?';
    return this.agent.name.split(' ').map(n => n[0]).join('').toUpperCase();
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/placeholder.jpg';
  }

  canDeleteImage(imageId?: number): boolean {
    const agentId = this.property?.agentId;
    const currentUserId = this.authService.getUserId();
    return imageId !== undefined && imageId !== null && agentId === currentUserId;
  }
deleteImage(imageId?: number): void {
  if (!imageId) return;

  this.propertyImageService.deleteImage(imageId).subscribe({
    next: () => {
      this.galleryImages = this.galleryImages.filter(img => img.id !== imageId);
      this.snackBar.open('Image deleted successfully', 'Close', { duration: 3000 });
    },
    error: err => {
      // Treat 204/200 empty as success (for backend empty responses)
      if (err.status === 200 || err.status === 204) {
        this.galleryImages = this.galleryImages.filter(img => img.id !== imageId);
        this.snackBar.open('Image deleted successfully', 'Close', { duration: 3000 });
      } else {
        this.snackBar.open('Failed to delete image', 'Close', { duration: 3000 });
      }
    }
  });
}

}
