import { Component, OnInit } from '@angular/core';
import { Property } from '../../../models/property.model';
import { PropertyService } from '../../../services/property.service';
import { FavoriteService } from '../../../services/favorite.service';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PropertyCardComponent } from '../property-card/property-card.component';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, PropertyCardComponent],
  providers: [DecimalPipe]
})
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  savedPropertyIds: number[] = [];
  isLoading: boolean = true;

  searchQuery: string = '';
  priceRange: string = 'all';
  sortBy: string = 'newest';

  constructor(
    private propertyService: PropertyService,
    private favoriteService: FavoriteService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProperties();
    this.loadSavedProperties();
  }

  loadProperties(): void {
    this.propertyService.getProperties().subscribe({
      next: (data: Property[]) => {
        this.properties = data;
        this.filteredProperties = data;
        this.sortProperties();
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  loadSavedProperties(): void {
    this.favoriteService.getFavorites().subscribe({
      next: (favorites) => {
        this.savedPropertyIds = favorites.map(f => f.id);
      },
      error: () => {
        this.savedPropertyIds = [];
      }
    });
  }

  filterProperties(): void {
    this.filteredProperties = this.properties.filter(property => {
      const matchesSearch = !this.searchQuery ||
        property.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (property.address && property.address.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (property.area && property.area.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
        (property.description && property.description.toLowerCase().includes(this.searchQuery.toLowerCase()));

      let matchesPrice = true;
      if (this.priceRange !== 'all') {
        const [min, max] = this.priceRange.split('-').map(Number);
        matchesPrice = property.price >= min && property.price <= max;
      }

      return matchesSearch && matchesPrice;
    });

    this.sortProperties();
  }

  sortProperties(): void {
    switch (this.sortBy) {
      case 'price-low':
        this.filteredProperties.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        this.filteredProperties.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
      default:
        this.filteredProperties.sort((a, b) => b.id - a.id);
        break;
    }
  }

  isSavedProperty(id: number): boolean {
    return this.savedPropertyIds.includes(id);
  }

  handleToggleSave(id: number): void {
    const property = this.properties.find(p => p.id === id);
    if (!property) return;

    this.favoriteService.toggleFavorite(property).subscribe({
      next: (isSaved) => {
        if (isSaved) {
          this.savedPropertyIds.push(id);
        } else {
          this.savedPropertyIds = this.savedPropertyIds.filter(pid => pid !== id);
        }
      }
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(['/property', id]);
  }
}
