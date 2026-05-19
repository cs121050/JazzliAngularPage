// src/app/pages/change-password/change-password.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../components/layout/layout.component';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="change-password-page">
        <h1>Change Password</h1>
        <p>This is a dummy screen – password change functionality will be implemented later.</p>
      </div>
    </app-layout>
  `,
  styles: [`
    .change-password-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
    }
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    p {
      color: #666;
    }
  `]
})
export class ChangePasswordComponent {}