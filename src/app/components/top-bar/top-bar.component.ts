import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="top-bar">
      <div class="top-bar-content">
        <!-- Left group: menu button (mobile only) + logo -->
        <div class="left-group">
          <button
            class="menu-button"
            *ngIf="isMobile"
            (click)="toggleMobileMenu()"
            aria-label="Open menu"
          >
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

        <!-- Desktop navigation (visible on non-mobile) -->
        <nav class="desktop-nav" *ngIf="!isMobile">
          <a routerLink="/download" routerLinkActive="active">Download</a>
          <a routerLink="/shop" routerLinkActive="active">Shop</a>
          <a routerLink="/about" routerLinkActive="active">About Us</a>
          <ng-container *ngIf="!authService.isLoggedIn(); else loggedInDesktop">
            <a routerLink="/login" routerLinkActive="active">Login / Signup</a>
          </ng-container>
          <ng-template #loggedInDesktop>
            <div class="user-info-desktop">
              <img [src]="authService.currentUser()?.photoURL || 'assets/default-avatar.png'"
                   alt="User avatar" class="user-avatar">
              <span class="user-email">{{ authService.currentUser()?.email }}</span>
              <button class="logout-button" (click)="logout()">Logout</button>
            </div>
          </ng-template>
        </nav>

        <!-- Right group: auth section (always on right) -->
        <div class="right-group">
          <ng-container *ngIf="!authService.isLoggedIn(); else loggedInMobile">
            <button class="login-button" (click)="navigateToLogin()">Login</button>
          </ng-container>
          <ng-template #loggedInMobile>
            <button class="logout-button-mobile" (click)="logout()" aria-label="Logout">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .top-bar {
    background: #123456;
    position: sticky;
    top: 0;
    width: 100%;
    height: 49px;     
    display: flex;     
    margin: 0;
    padding: 0;
    align-items: center;    /* vertically center children */
    z-index: 100;
  }

    .top-bar-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;   /* changed */
      padding: 0.75rem 1rem;
      width: 100%;
      margin: 0;
    }

    .right-group {
      margin-left: auto;             /* new */
    }

    /* Left group contains menu button (mobile) and logo */
    .left-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .logo-link {
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      text-decoration: none;
      font-family: "Inter Tight", sans-serif;
    }

    /* Desktop navigation */
    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 1.5rem;
    }

    .desktop-nav a {
      color: white;
      text-decoration: none;
      font-size: 1rem;
      transition: opacity 0.3s ease;
    }

    .desktop-nav a:hover,
    .desktop-nav a.active {
      opacity: 0.8;
      text-decoration: underline;
    }

    .user-info-desktop {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-email {
      color: white;
      font-size: 0.875rem;
    }

    .logout-button {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.25rem 0.75rem;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.75rem;
    }

    .logout-button:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    /* Mobile elements */
    .menu-button {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .login-button {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .logout-button-mobile {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
    }

    /* Responsive breakpoints */
    @media (max-width: 768px) {
      .desktop-nav {
        display: none;
      }
      .right-group {
        display: block;
      }
    }

    @media (min-width: 769px) {
      .menu-button {
        display: none;
      }
      /* On desktop, the left group only has logo */
      .left-group {
        flex: 0 0 auto;
      }
      .desktop-nav {
        display: flex;
      }
    }
  `]
})
export class TopBarComponent implements OnInit, OnDestroy {
  isMobile = false;
  private subscription: Subscription | null = null;

  constructor(
    public authService: AuthService,
    private navigationService: NavigationService
  ) {}

  ngOnInit() {
    this.subscription = this.navigationService.isMobile$.subscribe(
      isMobile => this.isMobile = isMobile
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  toggleMobileMenu() {
    window.dispatchEvent(new CustomEvent('toggleMenu'));
  }

  navigateToLogin() {
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'login' }));
  }

  logout() {
    this.authService.logout();
  }
}