import { Component, Inject, PLATFORM_ID, signal, effect, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class.sidebar-open]="isOpen()" class="sidebar-overlay" (click)="closeSidebar()">
      <div class="sidebar" (click)="$event.stopPropagation()">
        <!-- Header row with X and logo -->
        <div class="sidebar-header">
          <button class="close-button" (click)="closeSidebar()" aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
          <div class="sidebar-logo">Jazzli</div>
        </div>

        <!-- Menu items list -->
        <ul class="menu-list">
          @for (item of menuItems; track item.id) {
            <li>
              <button class="menu-item" (click)="onMenuItemClick(item)">
                {{ item.label }}
              </button>
            </li>
          }
        </ul>
      </div>
    </div>
  `,
  styles: [`
    .sidebar-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 200;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
    }

    .sidebar-overlay.sidebar-open {
      opacity: 1;
      visibility: visible;
    }

    .sidebar {
      position: fixed;
      top: 0;
      left: 0;
      width: 250px;
      height: 100vh;
      background: white;
      z-index: 201;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      display: flex;
      flex-direction: column;
      box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
    }

    .sidebar-overlay.sidebar-open .sidebar {
      transform: translateX(0);
    }

    .sidebar-header {
      background: #123456;
      padding: 0.75rem 1rem;
      display: flex;
      height: 25px;
      align-items: center;
      gap: 0.5rem;
    }

    .close-button {
      background: none;
      border: none;
      cursor: pointer;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
    }

    .sidebar-logo {
      font-size: 1.5rem;
      font-weight: 600;
      color: white;
      font-family: "Inter Tight", sans-serif;
    }

    .menu-list {
      list-style: none;
      padding: 0;
      margin: 0;
      flex: 1;
    }

    .menu-item {
      display: block;
      width: 100%;
      padding: 1rem 1.5rem;
      background: none;
      border: none;
      text-align: left;
      cursor: pointer;
      font-size: 1rem;
      color: #333;
      transition: background 0.2s ease;
      border-left: 3px solid transparent;
    }

    .menu-item:hover {
      background: #f5f5f5;
      border-left-color: #CC26D5;
    }

    @media (max-width: 768px) {
      .sidebar {
        width: 80vw;
      }
    }
  `]
})
export class SidebarComponent implements OnDestroy {
  isOpen = signal(false);
  isMobile = false;
  private subscriptions: Subscription[] = [];

  menuItems = [
    { id: 'download', label: 'Download' },
    { id: 'shop', label: 'Shop' },
    { id: 'about', label: 'About' },
  ];

  constructor(
    public authService: AuthService,
    private navigationService: NavigationService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    // Subscribe to isMobile changes
    this.subscriptions.push(
      this.navigationService.isMobile$.subscribe(isMobile => {
        this.isMobile = isMobile;
        this.updateMenuItems();
      })
    );

    // Subscribe to auth state changes
    this.subscriptions.push(
      this.authService.isLoggedIn$.subscribe(() => {
        this.updateMenuItems();
      })
    );

    // Optional: also listen to currentUser$ changes if you need more granular updates
    // this.subscriptions.push(
    //   this.authService.currentUser$.subscribe(() => this.updateMenuItems())
    // );

    // Listen for toggleMenu custom event
    if (typeof window !== 'undefined') {
      window.addEventListener('toggleMenu', () => {
        this.isOpen.update(v => !v);
      });
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updateMenuItems() {
    const baseItems = [
      { id: 'download', label: 'Download' },
      { id: 'shop', label: 'Shop' },
      { id: 'about', label: 'About' },
    ];
  }

  closeSidebar() {
    this.isOpen.set(false);
  }

}