import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { AuthService } from '../../services/auth.service';
import { Auth, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from '@angular/fire/auth';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="settings">
        <h1>Settings</h1>
        <p class="subtitle">Manage your account preferences</p>

        <!-- Tabs -->
        <div class="tabs">
          <button class="tab active">Authentication</button>
          <button class="tab">Preferences</button>
          <button class="tab">Notifications</button>
        </div>

        <!-- Authentication tab -->
        <div class="tab-content">
          <h2>Change Password</h2>

          <!-- Password change form -->
          <form (ngSubmit)="changePassword()" #passwordForm="ngForm" class="password-form">
            <!-- Current password -->
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                [(ngModel)]="currentPassword"
                required
                #currentPw="ngModel"
                class="form-control"
                placeholder="Enter your current password"
              />
              <div *ngIf="currentPw.invalid && currentPw.touched" class="error">
                Current password is required.
              </div>
            </div>

            <!-- New password -->
            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                [(ngModel)]="newPassword"
                required
                minlength="6"
                #newPw="ngModel"
                class="form-control"
                placeholder="Enter new password (min. 6 characters)"
              />
              <div *ngIf="newPw.invalid && newPw.touched" class="error">
                Password must be at least 6 characters.
              </div>
            </div>

            <!-- Confirm password -->
            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                [(ngModel)]="confirmPassword"
                required
                #confirmPw="ngModel"
                class="form-control"
                placeholder="Confirm your new password"
              />
              <div *ngIf="confirmPw.invalid && confirmPw.touched" class="error">
                Please confirm your password.
              </div>
              <div *ngIf="newPassword !== confirmPassword && confirmPw.touched" class="error">
                Passwords do not match.
              </div>
            </div>

            <!-- Submit and status -->
            <button
              type="submit"
              class="btn-primary"
              [disabled]="passwordForm.invalid || loading || newPassword !== confirmPassword"
            >
              {{ loading ? 'Updating...' : 'Update Password' }}
            </button>

            <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div *ngIf="successMessage" class="success-message">{{ successMessage }}</div>
          </form>
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

    .password-form {
      max-width: 400px;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.25rem;
    }
    .form-control {
      width: 100%;
      padding: 0.6rem;
      border: 1px solid #ddd;
      border-radius: 0.25rem;
      font-size: 1rem;
    }
    .form-control:focus {
      outline: none;
      border-color: #CC26D5;
    }
    .error {
      color: #dc2626;
      font-size: 0.85rem;
      margin-top: 0.25rem;
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
    .btn-primary:hover:not(:disabled) {
      opacity: 0.85;
    }
    .btn-primary:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .error-message {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #fee2e2;
      color: #dc2626;
      border-radius: 0.25rem;
    }
    .success-message {
      margin-top: 1rem;
      padding: 0.75rem;
      background: #dcfce7;
      color: #16a34a;
      border-radius: 0.25rem;
    }
  `]
})
export class SettingsComponent {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private auth: Auth
  ) {}

  async changePassword() {
    // Reset messages
    this.errorMessage = '';
    this.successMessage = '';

    // Validate
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }
    if (this.newPassword.length < 6) {
      this.errorMessage = 'New password must be at least 6 characters.';
      return;
    }

    this.loading = true;

    try {
      const user = this.auth.currentUser;
      if (!user) {
        throw new Error('No user logged in.');
      }

      // Re-authenticate with current password
      const credential = EmailAuthProvider.credential(
        user.email!,
        this.currentPassword
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, this.newPassword);

      this.successMessage = 'Password updated successfully!';
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    } catch (err: any) {
      console.error('Password change error:', err);
      // Map Firebase error codes to user-friendly messages
      if (err.code === 'auth/wrong-password') {
        this.errorMessage = 'Current password is incorrect.';
      } else if (err.code === 'auth/requires-recent-login') {
        this.errorMessage = 'Please log out and log in again before changing your password.';
      } else if (err.code === 'auth/weak-password') {
        this.errorMessage = 'New password is too weak. Choose a stronger one.';
      } else {
        this.errorMessage = err.message || 'Failed to change password. Please try again.';
      }
    } finally {
      this.loading = false;
    }
  }
}