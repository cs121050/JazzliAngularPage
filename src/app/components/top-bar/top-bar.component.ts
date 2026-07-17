import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, AppUser } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { generateIdenticon, stringToColor } from '../../utils/identicon';

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
                  [src]="getUserAvatar()"
                  alt="User avatar" 
                  class="user-avatar" 
                  [class.user-avatar-mobile]="(isMobile$ | async) === true"
                >
                <span class="user-email">
                  {{ (authService.currentUser$ | async)?.email || (authService.currentUser$ | async)?.displayName }}
                </span>
                <svg *ngIf="(isMobile$ | async) === false" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dropdown-arrow">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <!-- Dropdown -->
              <div class="dropdown-menu" [class.dropdown-menu-mobile]="(isMobile$ | async) === true" *ngIf="dropdownOpen">
                <button class="dropdown-item" (click)="goToUserPanel()">User Panel</button>
                <button class="dropdown-item" (click)="goToSettings()">Settings</button>  
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
    .user-avatar {
      border-radius: 50%;
      object-fit: cover;
      width: 36px;
      height: 36px;
    }
    .user-role {
      font-size: 0.7rem;
      opacity: 0.7;
      margin-left: 4px;
      text-transform: uppercase;
    }

    .dropdown-menu {
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background-color: rgba(128, 128, 128, 0.12);   /* gray */
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 200px;
    padding: 4px 0;
    z-index: 1000;
    border: 1px solid rgba(128, 128, 128, 0.12);
  }

  .dropdown-menu-mobile {
    position: fixed;
    top: 60px; /* adjust to your top bar height */
    left: 0;
    right: 0;
    width: 100%;
    border-radius: 0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    background-color: rgba(128, 128, 128, 0.12);   /* gray */
  }
  `]
})
export class TopBarComponent implements OnInit {
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

  ngOnInit() {
    // Any init logic if needed
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevents the click from bubbling up and closing immediately
    this.dropdownOpen = !this.dropdownOpen;
  }

  // Optional: close dropdown when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.dropdownOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.dropdownOpen = false;
    }
  }

  // -------- Existing methods --------

  getUserAvatar(): string {
    const user = this.authService.currentUser;
    if (!user) return '';

    // You could also use user.photoURL if available (e.g., from Google)

    const name = user.displayName || user.email || 'User';
    const color = stringToColor(name);
    return generateIdenticon(name, color, 200);
  }

  toggleMobileMenu() {
    this.navigationService.toggleMobileMenu();
  }

  goToChangePassword() {
    this.dropdownOpen = false;
    this.router.navigate(['/change-password']);
  }

  goToAdminPanel() {
    this.dropdownOpen = false;
    this.router.navigate(['/admin']);
  }

  goToUserPanel() {
    this.dropdownOpen = false;
    this.router.navigate(['/user-panel']);
  }

  goToSettings() {
    this.dropdownOpen = false;
    this.router.navigate(['/settings']);
  }

  logout() {
    this.dropdownOpen = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }
}