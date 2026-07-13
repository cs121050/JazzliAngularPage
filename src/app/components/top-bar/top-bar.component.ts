// src/app/components/top-bar/top-bar.component.ts
import { Component, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, AppUser } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="top-bar">
      <div class="top-bar-content">
        <!-- Left group -->
        <div class="left-group">
          <button class="menu-button" *ngIf="(isMobile$ | async) === true" (click)="toggleMobileMenu()">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div class="logo">
            <a routerLink="/" class="logo-link">Jazzli</a>
          </div>
        </div>

        <!-- Desktop navigation -->
        <nav class="desktop-nav" *ngIf="(isMobile$ | async) === false">
          <a routerLink="/download" routerLinkActive="active">Download</a>
          <a routerLink="/shop" routerLinkActive="active">Shop</a>
          <a routerLink="/about" routerLinkActive="active">About</a>
        </nav>

        <!-- Right group: auth section -->
        <div class="right-group">
          <ng-container *ngIf="(authService.isLoggedIn$ | async) === false; else userMenu">
            <button class="login-button" (click)="navigateToLogin()">Login</button>
          </ng-container>
          <ng-template #userMenu>
            <div #userMenuContainer class="user-menu-container">
              <div 
                class="user-menu" 
                [class.user-menu-mobile]="(isMobile$ | async) === true" 
                [class.user-menu-desktop]="(isMobile$ | async) === false" 
                (click)="toggleDropdown($event)"
              >
                <img 
                  [src]="(authService.currentUser$ | async)?.photoURL || (authService.currentUser$ | async)?.displayName? 'assets/default-avatar.png' : 'assets/default-avatar.png'"
                  alt="User avatar" 
                  class="user-avatar" 
                  [class.user-avatar-mobile]="(isMobile$ | async) === true"
                >
                <!-- Use Firebase user for email and photo, but we also display role -->
                <span *ngIf="(isMobile$ | async) === false" class="user-email">
                  {{ (authService.currentUser$ | async)?.email || (authService.currentUser$ | async)?.displayName }}
                  <span *ngIf="(authService.currentUser$ | async) as appUser" class="user-role">
                    ({{ appUser.role }})
                  </span>
                </span>
                <svg *ngIf="(isMobile$ | async) === false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dropdown-arrow">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <!-- Dropdown -->
              <div class="dropdown-menu" [class.dropdown-menu-mobile]="(isMobile$ | async) === true" *ngIf="dropdownOpen">
              <button class="dropdown-item" (click)="goToUserPanel()">User Panel</button>
              <button class="dropdown-item" (click)="goToSettings()">Settings</button>  
              <!-- Admin panel only for admins -->
                <button *ngIf="(authService.isAdmin$ | async)" class="dropdown-item" (click)="goToAdminPanel()">Admin Panel</button>
                <button class="dropdown-item" (click)="logout()">Logout</button>
              </div>
            </div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* ... your existing styles ... */
    /* Add small style for role */
    .user-role {
      font-size: 0.7rem;
      opacity: 0.7;
      margin-left: 4px;
      text-transform: uppercase;
    }
  `]
})
export class TopBarComponent {
  isMobile$: Observable<boolean>;
  dropdownOpen = false;

  constructor(
    public authService: AuthService,
    private navigationService: NavigationService,
    private elementRef: ElementRef,
    private router: Router
  ) {
    this.isMobile$ = this.navigationService.isMobile$;
  }

  // ... existing methods ...

  goToChangePassword() {
    this.dropdownOpen = false;
    this.router.navigate(['/change-password']);
  }

  goToAdminPanel() {
    this.dropdownOpen = false;
    this.router.navigate(['/admin']); // You'll need to create this route later
  }

  goToUserPanel() {
  this.dropdownOpen = false;
  this.router.navigate(['/user-panel']);
  }
  
  goToSettings() {
    this.dropdownOpen = false;
    this.router.navigate(['/settings']);
  }
        
  // ... rest unchanged ...
}