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
                  <!-- 👇 Remove this <span> if you don't want the role displayed -->
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
    /* ── Top bar container ── */
    .top-bar {
      background: #1a1a2e;
      color: #fff;
      padding: 0 1.5rem;
      height: 64px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #2a2a4a;
      box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .top-bar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      max-width: 1200px;
      margin: 0 auto;
    }

    .left-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .menu-button {
      background: none;
      border: none;
      color: #fff;
      cursor: pointer;
      padding: 4px;
      display: flex;
      align-items: center;
    }

    .logo-link {
      font-size: 1.5rem;
      font-weight: 700;
      color: #fff;
      text-decoration: none;
      letter-spacing: 0.5px;
      background: linear-gradient(135deg, #f093fb, #f5576c);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 2rem;
      margin: 0 1.5rem;
    }

    .desktop-nav a {
      color: #b0b0d0;
      text-decoration: none;
      font-size: 1rem;
      font-weight: 500;
      transition: color 0.2s;
      position: relative;
    }

    .desktop-nav a:hover {
      color: #fff;
    }

    .desktop-nav a.active::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: 0;
      right: 0;
      height: 2px;
      background: #f5576c;
      border-radius: 2px;
    }

    .right-group {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .login-button {
      background: #f5576c;
      border: none;
      color: #fff;
      padding: 0.4rem 1.2rem;
      border-radius: 20px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, transform 0.1s;
    }

    .login-button:hover {
      background: #e8495e;
    }

    .login-button:active {
      transform: scale(0.96);
    }

    .user-menu-container {
      position: relative;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.3rem 0.8rem 0.3rem 0.3rem;
      border-radius: 30px;
      cursor: pointer;
      transition: background 0.2s;
      background: rgba(255,255,255,0.05);
      border: 1px solid transparent;
    }

    .user-menu:hover {
      background: rgba(255,255,255,0.12);
      border-color: rgba(255,255,255,0.15);
    }

    .user-avatar {
      border-radius: 50%;
      object-fit: cover;
      width: 36px;
      height: 36px;
      border: 2px solid #f5576c;
    }

    .user-avatar-mobile {
      width: 32px;
      height: 32px;
    }

    .user-email {
      font-size: 0.9rem;
      color: #e0e0f0;
      white-space: nowrap;
      max-width: 150px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .dropdown-arrow {
      color: #b0b0d0;
      flex-shrink: 0;
    }

    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background: #252545;
      border-radius: 12px;
      min-width: 180px;
      padding: 0.5rem 0;
      box-shadow: 0 8px 24px rgba(0,0,0,0.5);
      border: 1px solid #3a3a5a;
      z-index: 1001;
      display: flex;
      flex-direction: column;
    }

    .dropdown-menu-mobile {
      position: fixed;
      top: 64px;
      left: 0;
      right: 0;
      width: 100%;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid #3a3a5a;
      box-shadow: 0 8px 24px rgba(0,0,0,0.6);
    }

    .dropdown-item {
      background: none;
      border: none;
      color: #d0d0e8;
      padding: 0.7rem 1.5rem;
      text-align: left;
      font-size: 0.95rem;
      cursor: pointer;
      transition: background 0.15s, color 0.15s;
      width: 100%;
    }

    .dropdown-item:hover {
      background: rgba(255,255,255,0.08);
      color: #fff;
    }

    .dropdown-item:active {
      background: rgba(255,255,255,0.15);
    }

    /* ── Mobile adjustments ── */
    @media (max-width: 768px) {
      .top-bar {
        padding: 0 1rem;
      }

      .user-email {
        max-width: 100px;
        font-size: 0.8rem;
      }

      .user-menu {
        padding: 0.2rem 0.5rem 0.2rem 0.2rem;
      }

      .dropdown-menu {
        min-width: 100%;
      }
    }   /* ✅ This closing brace was missing — now fixed */
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

  ngOnInit() { }

  /**
   * Returns the user's avatar URL:
   * - Uses photoURL from Firebase if available (Google sign-in)
   * - Falls back to generated identicon (based on email or display name)
   */
  getUserAvatar(): string {
    const user = this.authService.currentUser;
    if (!user) return '';

    // If you want to use photoURL from Firebase, uncomment:
    // const firebaseUser = this.authService.auth.currentUser;
    // if (firebaseUser?.photoURL) return firebaseUser.photoURL;

    const name = user.displayName || user.email || 'User';
    const color = stringToColor(name);
    return generateIdenticon(name, color, 200);
  }

  // ─── Navigation methods ───────────────────────────────────────────
  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileMenu() {
    // Implement your mobile menu toggle (e.g., emit event, open sidebar)
    console.log('Mobile menu toggled');
    // Example: if you have a service, call it.
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