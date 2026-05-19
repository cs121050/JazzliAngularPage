import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, TopBarComponent, SidebarComponent],
  template: `
    <app-top-bar></app-top-bar>
    <app-sidebar></app-sidebar>
    <div class="layout-container">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    .layout-container {
      padding: 2rem 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    @media (max-width: 768px) {
      .layout-container {
        padding: 1.5rem 1rem;
      }
    }
  `]
})
export class LayoutComponent {}