import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PropertyService } from '../../../services/property.service';
import { ImageUploadService } from '../../../services/image-upload.service';
import { Property } from '../../../models/property.model';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './property-form.component.html',
  styleUrls: ['./property-form.component.scss']
})
export class PropertyFormComponent implements OnInit {
  propertyForm: FormGroup;
  isEditMode = false;
  propertyId: number | null = null;
  isLoading = false;
  error = '';
  selectedFiles: File[] = [];
  imagePreviewUrls: string[] = [];
  uploadingImages = false;
  existingImages: any[] = [];

  constructor(
    private fb: FormBuilder,
    private propertyService: PropertyService,
    private imageUploadService: ImageUploadService,
    private authService: AuthService,
    public router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar 
  ) {
    this.propertyForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      area: ['', Validators.required],
      address: ['', Validators.required],
      latitude: [0, Validators.required],
      longitude: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.propertyId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.propertyId) {
      this.isEditMode = true;
      this.loadProperty();
    }
  }

  loadProperty() {
    this.propertyService.getPropertyById(this.propertyId!).subscribe((property: Property) => {
      this.propertyForm.patchValue({
        title: property.title,
        description: property.description,
        price: property.price,
        area: property.area,
        address: property.address,
        latitude: property.latitude,
        longitude: property.longitude,
      });
      this.existingImages = property.images || [];
    });
  }

  onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const files = Array.from(input.files);
    for (const file of files) {
      const validation = this.imageUploadService.validateImageFile(file);
      if (!validation.valid) {
        if (validation.error) {
  this.snackBar.open(validation.error, 'Close', { duration: 3000 });
} else {
  this.snackBar.open('An error occurred', 'Close', { duration: 3000 });
}

        continue;
      }
      this.selectedFiles.push(file);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviewUrls.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
    input.value = '';
  }

  removeImage(index: number): void {
    this.imagePreviewUrls.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  async uploadAllImages(): Promise<string[]> {
    if (this.selectedFiles.length === 0) return [];
    this.uploadingImages = true;
    const uploadedUrls: string[] = [];
    for (const file of this.selectedFiles) {
      try {
        const response = await this.imageUploadService.uploadImage(file).toPromise();
        if (response) {
          uploadedUrls.push(response.url);
          console.log('Uploaded:', response.filename);
        }
      } catch (error) {
        console.error('Upload error:', error);
        this.snackBar.open(`Failed to upload ${file.name}`, 'Close', { duration: 3000 }); // Replace alert
      }
    }
    this.uploadingImages = false;
    return uploadedUrls;
  }

  async onSubmit(): Promise<void> {
    if (!this.propertyForm.valid) {
      this.error = 'Please fill in all required fields.';
      return;
    }
    this.isLoading = true;
    this.error = '';
    try {
      const imageUrls = await this.uploadAllImages();
      const allImages = [
        ...this.existingImages,
        ...imageUrls.map(url => ({ imageUrl: url }))
      ];
      const agentId = this.authService.getUserId();

      const propertyData: any = {
        ...this.propertyForm.value,
        images: allImages,
        agentId: agentId
      };

      if (this.isEditMode && this.propertyId) {
        this.propertyService.updateProperty(this.propertyId, propertyData).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Property updated successfully!', 'Close', { duration: 3000 }); // SnackBar instead of alert
            this.router.navigate(['/agent-dashboard']);
          },
          error: () => {
            this.isLoading = false;
            this.error = 'Failed to update property.';
            this.snackBar.open('Failed to update property.', 'Close', { duration: 3000 }); // Feedback via snackbar
          }
        });
      } else {
        this.propertyService.createProperty(propertyData).subscribe({
          next: () => {
            this.isLoading = false;
            this.snackBar.open('Property created successfully!', 'Close', { duration: 3000 }); // SnackBar instead of alert
            this.router.navigate(['/agent-dashboard']);
          },
          error: () => {
            this.isLoading = false;
            this.error = 'Failed to create property.';
            this.snackBar.open('Failed to create property.', 'Close', { duration: 3000 }); // Feedback via snackbar
          }
        });
      }
    } catch (error) {
      this.isLoading = false;
      this.error = 'Failed to process images.';
      this.snackBar.open('Failed to process images.', 'Close', { duration: 3000 });
    }
  }
}
