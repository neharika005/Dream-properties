import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Property } from '../../models/property.model';
import { FavoriteService } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe]
})
export class FavoritesComponent implements OnInit {
  favorites: Property[] = [];
  isLoading = true;
  error: string = '';

  constructor(
    private favoriteService: FavoriteService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const buyerId = this.authService.getUserId();
    if (buyerId == null) {
      this.error = 'Please log in as a buyer to view favorites.';
      this.favorites = [];
      this.isLoading = false;
      return;
    }
    this.favoriteService.getFavorites().subscribe({
      next: (data) => {
        this.favorites = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'Error loading favorite properties.';
        this.isLoading = false;
      }
    });
  }
}
