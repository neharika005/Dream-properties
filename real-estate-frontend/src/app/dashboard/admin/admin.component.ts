import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, User } from '../../services/admin.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  agents: User[] = [];
  isLoading = true;
  errorMsg = '';

  constructor(
    private adminService: AdminService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadAgents();
  }

  loadAgents(): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.adminService.getAllAgents().subscribe({
      next: data => {
        this.agents = data;
        this.isLoading = false;
      },
      error: err => {
        this.errorMsg = 'Failed to load agents.';
        console.error('Load agents error:', err);
        this.isLoading = false;
      }
    });
  }

  approveAgent(agentId: number): void {
    this.adminService.approveAgent(agentId).subscribe({
      next: () => {
        this.snackBar.open('Agent approved.', '', { duration: 2200 });
        this.loadAgents();  // Reload the list after approval
      },
      error: err => {
        console.error('Approve error:', err);
        this.snackBar.open('failed.', '', { duration: 2200 });
      }
    });
  }

  disapproveAgent(agentId: number): void {
    this.adminService.disapproveAgent(agentId).subscribe({
      next: () => {
        this.snackBar.open('Agent disapproved.', '', { duration: 2200 });
        this.loadAgents();  // Reload the list after disapproval
      },
      error: err => {
        console.error('Disapprove error:', err);
        this.snackBar.open('failed.', '', { duration: 2200 });
      }
    });
  }
}
