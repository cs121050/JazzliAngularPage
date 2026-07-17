// src/app/components/top-bar/top-bar.component.ts
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService, AppUser } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { generateIdenticon, stringToColor } from '../../utils/identicon';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: ` <!-- KEEP YOUR EXISTING TEMPLATE (unchanged) --> `,
  styles: [`
    /* ============================================================
       MAIN TOP‑BAR LAYOUT (required for the bar to look normal)
       ============================================================ */
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

    /* ============================================================
       USER MENU (desktop & mobile)
       ============================================================ */
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

    /* Desktop: subtle hover only (no permanent background) */
    .user-menu:hover {
      background: rgba(255, 255, 255, 0.08);
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

    .dropdown-arrow {
      stroke: rgba(255, 255, 255, 0.7);
      flex-shrink: 0;
    }

    /* ============================================================
       MOBILE OVERRIDES (gray background + flash on tap)
       ============================================================ */
    .user-menu-mobile {
      padding: 8px 12px;
      border-radius: 8px;
      background-color: rgba(128, 128, 128, 0.12);   /* always gray */
      border: 1px solid rgba(128, 128, 128, 0.15);
      user-select: none;
      -webkit-user-select: none;
      transition: background-color 0.1s ease;
      -webkit-tap-highlight-color: transparent;
    }

    /* Dark flash while tapping (active) */
    .user-menu-mobile:active {
      background-color: #0f0f10;      /* matches top‑bar background */
      border-color: #0f0f10;
    }

    .user-menu-mobile:active .user-email {
      color: white;
    }

    .user-menu-mobile:active .dropdown-arrow {
      stroke: white;
    }

    /* ============================================================
       DROPDOWN MENU – gray background
       ============================================================ */
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      background-color: rgba(128, 128, 128, 0.12);
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      min-width: 200px;
      padding: 4px 0;
      z-index: 1000;
      border: 1px solid rgba(128, 128, 128, 0.12);
    }

    .dropdown-menu-mobile {
      position: fixed;
      top: 60px;               /* adjust to your top‑bar height */
      left: 0;
      right: 0;
      width: 100%;
      border-radius: 0;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      background-color: rgba(128, 128, 128, 0.12);
    }

    .dropdown-item {
      display: block;
      width: 100%;
      text-align: left;
      background: none;
      border: none;
      color: #222;              /* dark text for contrast */
      font-size: 0.9rem;
      padding: 10px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s ease, color 0.2s ease;
    }

    .dropdown-item:hover {
      background: rgba(0, 0, 0, 0.08);
      color: #000;
    }

    /* leftover styles (keep for compatibility) */
    .user-role {
      font-size: 0.7rem;
      opacity: 0.7;
      margin-left: 4px;
      text-transform: uppercase;
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

  ngOnInit() {}

  getUserAvatar(): string {
    const user = this.authService.currentUser;
    if (!user) return '';
    // Check for Google photo
    const firebaseUser = (this.authService as any).auth?.currentUser;
    if (firebaseUser?.photoURL) {
      return firebaseUser.photoURL;
    }
    const name = user.displayName || user.email || 'User';
    const color = stringToColor(name);
    return generateIdenticon(name, color, 200);
  }

  // ===== ADD THESE THREE METHODS (fixes build errors) =====
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

  // ===== EXISTING NAVIGATION METHODS =====
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