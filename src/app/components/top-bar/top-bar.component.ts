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
                  [src]="'assets/default-avatar.png'"
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
    .top-bar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      width: 100%;
      height: 64px;
      background: #0f0f10;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      z-index: 1000;
      box-sizing: border-box;
    }

    .top-bar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      max-width: 1280px;
      margin: 0 auto;
      padding: 0 24px;
      gap: 16px;
      box-sizing: border-box;
    }

    .left-group {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .logo-link {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
      text-decoration: none;
      letter-spacing: 0.02em;
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 32px;
    }

    .desktop-nav a {
      color: rgba(255, 255, 255, 0.75);
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      padding: 8px 0;
      transition: color 0.2s ease;
      position: relative;
    }

    .desktop-nav a:hover {
      color: #ffffff;
    }

    .desktop-nav a.active {
      color: #ffffff;
    }

    .desktop-nav a.active::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background: #ffffff;
      border-radius: 2px;
    }

    .right-group {
      display: flex;
      align-items: center;
      margin-left: auto;
    }

    .user-menu-container {
      position: relative;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      padding: 6px 10px;
      border-radius: 24px;
      transition: background 0.2s ease;
    }

    .user-menu:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .user-menu-mobile {
      padding: 4px;
    }

    .user-menu-desktop {
      padding: 6px 12px;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
      background: rgba(255, 255, 255, 0.1);
    }

    .user-avatar-mobile {
      width: 28px;
      height: 28px;
    }

    .user-email {
      display: flex;
      align-items: center;
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.875rem;
      max-width: 180px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .user-role {
      font-size: 0.7rem;
      opacity: 0.7;
      margin-left: 4px;
      text-transform: uppercase;
    }

    .dropdown-arrow {
      stroke: rgba(255, 255, 255, 0.7);
      flex-shrink: 0;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: #1a1a1c;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      min-width: 200px;
      z-index: 1100;
      display: flex;
      flex-direction: column;
      padding: 6px;
      overflow: hidden;
    }

    .dropdown-menu-mobile {
      right: 0;
      left: auto;
    }

    .dropdown-item {
      display: block;
      width: 100%;
      text-align: left;
      background: none;
      border: none;
      color: rgba(255, 255, 255, 0.85);
      font-size: 0.9rem;
      padding: 10px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease;
    }

    .dropdown-item:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }

    .menu-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: none;
      border: none;
      color: #ffffff;
      cursor: pointer;
      border-radius: 6px;
      transition: background 0.2s ease;
    }

    .menu-button:hover {
      background: rgba(255, 255, 255, 0.08);
    }

    .login-button {
      background: #ffffff;
      color: #0f0f10;
      border: 1px solid #ffffff;
      border-radius: 20px;
      padding: 8px 20px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
    }

    .login-button:hover {
      background: transparent;
      color: #ffffff;
      transform: translateY(-1px);
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

  toggleMobileMenu() {
    this.navigationService.toggleMobileMenu();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click')
  closeDropdown() {
    this.dropdownOpen = false;
  }

  goToChangePassword() {
    this.dropdownOpen = false;
    this.router.navigate(['/change-password']);
  }

  goToAdminPanel() {
    this.dropdownOpen = false;
    this.router.navigate(['/admin']); // You'll need to create this route later
  }

  async logout() {
    this.dropdownOpen = false;
    await this.authService.logout();
    this.router.navigate(['/']);
  }
}