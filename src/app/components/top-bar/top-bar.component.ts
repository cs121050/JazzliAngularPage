import { Component, Inject, PLATFORM_ID, OnInit, OnDestroy, ElementRef, HostListener } from '@angular/core';
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
          <a routerLink="/about" routerLinkActive="active">About</a>
          <!-- Login/Signup link removed from desktop nav -->
        </nav>

        <!-- Right group: auth section (always on right) -->
        <div class="right-group">
          <ng-container *ngIf="!authService.isLoggedIn(); else userMenu">
            <button class="login-button" (click)="navigateToLogin()">Login</button>
          </ng-container>
          <ng-template #userMenu>
            <div #userMenuContainer class="user-menu-container">
              <div 
                class="user-menu" 
                [class.user-menu-mobile]="isMobile" 
                [class.user-menu-desktop]="!isMobile" 
                (click)="toggleDropdown($event)"
              >
                <img 
                  [src]="authService.currentUser()?.photoURL || 'assets/default-avatar.png'" 
                  alt="User avatar" 
                  class="user-avatar" 
                  [class.user-avatar-mobile]="isMobile"
                >
                <span *ngIf="!isMobile" class="user-email">{{ authService.currentUser()?.email }}</span>
                <svg *ngIf="!isMobile" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="dropdown-arrow">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </div>
              <div class="dropdown-menu" [class.dropdown-menu-mobile]="isMobile" *ngIf="dropdownOpen">
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
      background: #123456;
      position: sticky;
      top: 0;
      width: 100%;
      height: 49px;
      display: flex;
      margin: 0;
      padding: 0;
      align-items: center;
      z-index: 100;
    }

    .top-bar-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0.75rem 1rem;
      width: 100%;
      margin: 0;
      gap: 2rem;
    }

    .right-group {
      margin-left: auto;
      position: relative;
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
      font-family: "Inter Tight", sans-serif;
      transition: opacity 0.3s ease;
    }

    .desktop-nav a:hover,
    .desktop-nav a.active {
      opacity: 0.8;
      text-decoration: underline;
    }

    /* User menu container */
    .user-menu-container {
      position: relative;
      display: inline-block;
    }

    .user-menu {
      cursor: pointer;
      transition: background 0.2s ease;
    }

    .user-menu-desktop {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
    }

    .user-menu-desktop:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .user-menu-mobile {
      padding: 0.25rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-menu-mobile:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-avatar-mobile {
      width: 32px;
      height: 32px;
    }

    .user-email {
      color: white;
      font-size: 0.875rem;
      font-family: "Inter Tight", sans-serif;
    }

    .dropdown-arrow {
      stroke: white;
    }

    /* Dropdown menu */
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      margin-top: 0.5rem;
      background: white;
      border-radius: 0.5rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      min-width: 120px;
      z-index: 150;
      overflow: hidden;
    }

    .dropdown-menu-mobile {
      right: 0;
      left: auto;
    }

    .dropdown-item {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      text-align: left;
      background: none;
      border: none;
      color: #333;
      cursor: pointer;
      font-size: 0.875rem;
      font-family: "Inter Tight", sans-serif;
      transition: background 0.2s ease;
    }

    .dropdown-item:hover {
      background: #f5f5f5;
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
      font-family: "Inter Tight", sans-serif;
      transition: background 0.2s ease;
    }

    .login-button:hover {
      background: rgba(255, 255, 255, 0.3);
    }
`]
})
export class TopBarComponent implements OnInit, OnDestroy {
  isMobile = false;
  dropdownOpen = false;
  private subscription: Subscription | null = null;

  constructor(
    public authService: AuthService,
    private navigationService: NavigationService,
    private elementRef: ElementRef
  ) {}

  ngOnInit() {
    this.subscription = this.navigationService.isMobile$.subscribe(
      isMobile => this.isMobile = isMobile
    );
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const userMenuContainer = this.elementRef.nativeElement.querySelector('.user-menu-container');
    
    if (userMenuContainer && !userMenuContainer.contains(target)) {
      this.dropdownOpen = false;
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleMobileMenu() {
    window.dispatchEvent(new CustomEvent('toggleMenu'));
  }

  navigateToLogin() {
    window.dispatchEvent(new CustomEvent('navigateTo', { detail: 'login' }));
  }

  logout() {
    this.dropdownOpen = false;
    this.authService.logout();
  }
}