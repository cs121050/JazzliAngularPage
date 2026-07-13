import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../components/layout/layout.component';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="user-panel">
        <h1>User Panel</h1>
        <p>Welcome to your personal dashboard.</p>
        <div class="dummy-content">
          <p>User‑specific information will appear here later.</p>
        </div>
      </div>
    </app-layout>
  `,
  styles: [`
    .user-panel {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem 0;
    }
    h1 {
      font-size: 2rem;
      color: #123456;
    }
    .dummy-content {
      background: #f5f5f5;
      padding: 1.5rem;
      border-radius: 0.5rem;
      margin-top: 1.5rem;
    }
  `]
})
export class UserPanelComponent {}