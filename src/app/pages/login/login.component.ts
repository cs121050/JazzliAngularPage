// login.component.ts
import { Component, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LayoutComponent } from '../../components/layout/layout.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="login-container">
        <div class="login-card">
          <h1 class="title">Jazzli</h1>

          <!-- Email Field -->
          <div class="input-group">
            <label class="input-label">Email</label>
            <div class="input-icon-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <input
                type="email"
                [(ngModel)]="email"
                placeholder="your@email.com"
                class="input-field"
                [disabled]="loading"
                (keyup.enter)="submit()"
              />
            </div>
          </div>

          <!-- Password Field with visibility toggle -->
          <div class="input-group">
            <label class="input-label">Password</label>
            <div class="input-icon-wrapper">
              <svg class="input-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                [type]="passwordVisible ? 'text' : 'password'"
                [(ngModel)]="password"
                placeholder="••••••••"
                class="input-field"
                [disabled]="loading"
                (keyup.enter)="submit()"
              />
              <button
                type="button"
                class="password-toggle"
                (click)="passwordVisible = !passwordVisible"
                tabindex="-1"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                  <line *ngIf="passwordVisible" x1="23" y1="1" x2="1" y2="23"></line>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Message -->
          <div *ngIf="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <!-- Submit Button (Sign In / Sign Up) -->
          <button
            class="submit-button"
            (click)="submit()"
            [disabled]="loading"
          >
            <span *ngIf="!loading">{{ isSignUp ? 'Sign Up' : 'Sign In' }}</span>
            <div *ngIf="loading" class="spinner"></div>
          </button>

          <!-- Toggle between Sign In and Sign Up -->
          <button
            class="toggle-mode"
            (click)="toggleMode()"
            [disabled]="loading"
          >
            <ng-container *ngIf="!isSignUp">Don't have an account? Sign Up</ng-container>
            <ng-container *ngIf="isSignUp">Already have an account? Sign In</ng-container>
          </button>

          <!-- Forgot Password (only in Sign In mode) -->
          <button
            *ngIf="!isSignUp"
            class="forgot-password"
            (click)="forgotPassword()"
            [disabled]="loading"
          >
            Forgot password?
          </button>

          <div class="divider">or</div>

          <!-- Google Sign-In Button -->
          <button
            class="google-button"
            (click)="signInWithGoogle()"
            [disabled]="loading"
          >
            <img src="https://www.gstatic.com/images/branding/product/1x/googleg_64dp.png" alt="Google" width="20" height="20">
            <span>Continue with Google</span>
          </button>
        </div>
      </div>
    </app-layout>
  `,
  styles: [`
    * { font-family: "Inter Tight", sans-serif; }
    .login-container { display: flex; justify-content: center; align-items: center; min-height: calc(100vh - 49px); padding: 2rem 1rem; }
    .login-card { background: white; border-radius: 1rem; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08); padding: 2rem; width: 100%; max-width: 420px; }
    .title { font-size: 2rem; font-weight: 600; text-align: center; margin-bottom: 2rem; background: linear-gradient(90deg, #F0060B 0%, #CC26D5 50%, #7702FF 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
    .input-group { margin-bottom: 1.25rem; }
    .input-label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 0.5rem; color: #333; }
    .input-icon-wrapper { position: relative; display: flex; align-items: center; }
    .input-icon { position: absolute; left: 12px; color: #999; pointer-events: none; }
    .input-field { width: 100%; padding: 0.75rem 0.75rem 0.75rem 2.5rem; border: 1px solid #ddd; border-radius: 0.5rem; font-size: 1rem; }
    .input-field:focus { outline: none; border-color: #CC26D5; }
    .input-field:disabled { background: #f5f5f5; cursor: not-allowed; }
    .password-toggle { position: absolute; right: 12px; background: none; border: none; cursor: pointer; color: #999; padding: 0; }
    .error-message { background: #fee2e2; color: #dc2626; padding: 0.75rem; border-radius: 0.5rem; font-size: 0.875rem; margin-bottom: 1.25rem; }
    .submit-button { width: 100%; background: linear-gradient(90deg, #F0060B 0%, #CC26D5 50%, #7702FF 100%); color: white; border: none; padding: 0.75rem; border-radius: 0.5rem; font-size: 1rem; font-weight: 600; cursor: pointer; margin-bottom: 0.75rem; display: flex; justify-content: center; align-items: center; min-height: 48px; }
    .submit-button:hover:not(:disabled) { transform: scale(1.02); }
    .submit-button:disabled { opacity: 0.6; cursor: not-allowed; }
    .toggle-mode, .forgot-password { width: 100%; background: none; border: none; color: #CC26D5; font-size: 0.875rem; cursor: pointer; padding: 0.5rem; margin-bottom: 0.5rem; }
    .toggle-mode:hover:not(:disabled), .forgot-password:hover:not(:disabled) { opacity: 0.8; text-decoration: underline; }
    .divider { text-align: center; margin: 1.5rem 0; position: relative; color: #999; font-size: 0.875rem; }
    .divider::before, .divider::after { content: ''; position: absolute; top: 50%; width: calc(50% - 30px); height: 1px; background: #ddd; }
    .divider::before { left: 0; }
    .divider::after { right: 0; }
    .google-button { width: 100%; display: flex; align-items: center; justify-content: center; gap: 0.75rem; background: white; border: 1px solid #ddd; padding: 0.75rem; border-radius: 0.5rem; font-size: 1rem; cursor: pointer; }
    .google-button:hover:not(:disabled) { background: #f9f9f9; }
    .google-button:disabled { opacity: 0.6; cursor: not-allowed; }
    .spinner { width: 20px; height: 20px; border: 2px solid white; border-top-color: transparent; border-radius: 50%; animation: spin 0.6s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    @media (max-width: 480px) { .login-card { padding: 1.5rem; } .title { font-size: 1.75rem; } }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  email = '';
  password = '';
  isSignUp = false;
  loading = false;
  errorMessage = '';
  passwordVisible = false;

  async submit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter email and password';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      if (this.isSignUp) {
        await this.authService.signUpWithEmail(this.email, this.password);
      } else {
        await this.authService.signInWithEmail(this.email, this.password);
      }
      this.router.navigate(['/']);
    } catch (err: any) {
      this.errorMessage = this.getFirebaseErrorMessage(err.code);
      this.cdr.detectChanges();
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  toggleMode() {
    this.isSignUp = !this.isSignUp;
    this.errorMessage = '';
  }

  async forgotPassword() {
    if (!this.email) {
      this.errorMessage = 'Please enter your email address first';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      await this.authService.sendPasswordResetEmail(this.email);
      this.errorMessage = 'Password reset email sent! Check your inbox.';
      this.cdr.detectChanges();
    } catch (err: any) {
      this.errorMessage = this.getFirebaseErrorMessage(err.code);
      this.cdr.detectChanges();
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  async signInWithGoogle() {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    try {
      await this.authService.signInWithGoogle();
      this.router.navigate(['/']);
    } catch (err: any) {
      this.errorMessage = this.getFirebaseErrorMessage(err.code);
      this.cdr.detectChanges();
    } finally {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  private getFirebaseErrorMessage(code: string): string {
    switch (code) {
      case 'auth/invalid-email': return 'Invalid email address.';
      case 'auth/user-disabled': return 'This account has been disabled.';
      case 'auth/user-not-found': return 'No account found with this email.';
      case 'auth/wrong-password': return 'Incorrect password.';
      case 'auth/email-already-in-use': return 'Email already registered.';
      case 'auth/weak-password': return 'Password should be at least 6 characters.';
      case 'auth/invalid-credential':
      case 'auth/invalid-login-credentials':
        return 'Invalid email or password.';
      default: return 'An error occurred. Please try again.';
    }
  }
}