import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Inquiry } from '../../models/inquiry.model'; // ✅ Import from model
import { InquiryService } from '../../services/inquiry.service';

@Component({
  selector: 'app-inquiries',
  templateUrl: './inquiry.component.html',
  styleUrls: ['./inquiry.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class InquiriesComponent implements OnInit {
  inquiries: Inquiry[] = [];
  isLoading = true;

  constructor(private inquiryService: InquiryService) {}

  ngOnInit(): void {
  this.inquiryService.getInquiries().subscribe({
    next: (data: Inquiry[]) => {
      this.inquiries = data;
      this.isLoading = false;
    },
    error: (err: any) => {
      console.error(err);
      this.isLoading = false;
    }
  });
}

}
