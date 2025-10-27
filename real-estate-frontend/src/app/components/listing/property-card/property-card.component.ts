import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Property } from '../../../models/property.model';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { getImageUrl } from '../../../utils/img-utils';



@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe],
  templateUrl: './property-card.component.html',
  styleUrls: ['./property-card.component.scss']
})
export class PropertyCardComponent {
  @Input() property!: Property;
  @Input() isSaved: boolean = false;

  @Output() toggleSave = new EventEmitter<number>();
  @Output() viewDetails = new EventEmitter<number>();

  onToggleSave() {
    this.toggleSave.emit(this.property.id);
  }

  onViewDetails() {
    this.viewDetails.emit(this.property.id);
  }

  getFirstImageUrl(): string {
    if (this.property.images && this.property.images.length > 0) {
      return getImageUrl(this.property.images[0].imageUrl);
    }
    return 'assets/placeholder.jpg';
  }

  onImgError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/placeholder.jpg';
  }
}
