import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, RouterModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="settings">
        <h1>Settings</h1>
        <p class="subtitle">Manage your account preferences</p>

        <!-- Tabs (dummy) -->
        <div class="tabs">
          <button class="tab active">Authentication</button>
          <button class="tab">Preferences</button>
          <button class="tab">Notifications</button>
        </div>

        <!-- Authentication tab content -->
        <div class="tab-content">
          <h2>Change Password</h2>
          <p>Click below to update your password.</p>
          <button class="btn-primary" (click)="goToChangePassword()">
            Change Password
          </button>
          <p class="note">(This will redirect to a dedicated change‑password page for now.)</p>
        </div>
      </div>
    </app-layout>
  `,
  styles: [`
    .settings {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 0;
    }
    h1 {
      font-size: 2rem;
      color: #123456;
      margin-bottom: 0.5rem;
    }
    .subtitle {
      color: #666;
      margin-bottom: 2rem;
    }
    .tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 2px solid #eee;
      margin-bottom: 1.5rem;
    }
    .tab {
      padding: 0.75rem 1.5rem;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      font-size: 1rem;
      cursor: pointer;
      color: #666;
    }
    .tab.active {
      color: #CC26D5;
      border-bottom-color: #CC26D5;
    }
    .tab-content {
      padding: 1rem 0;
    }
    .btn-primary {
      background: linear-gradient(90deg, #F0060B, #CC26D5);
      color: white;
      border: none;
      padding: 0.6rem 1.5rem;
      border-radius: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-primary:hover {
      opacity: 0.85;
    }
    .note {
      margin-top: 1rem;
      color: #999;
      font-style: italic;
      font-size: 0.9rem;
    }
  `]
})
export class SettingsComponent {
  constructor(private router: import('@angular/router').Router) {}
  goToChangePassword() {
    this.router.navigate(['/change-password']);
  }
}