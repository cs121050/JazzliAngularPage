import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../components/layout/layout.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="login-page">
        <h1>Login / Signup</h1>
        <p>Dummy page - Connect with Firebase Auth</p>
      </div>
    </app-layout>
  `,
  styles: [`
    .login-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 60vh;
      text-align: center;
    }

    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
    }

    p {
      color: #666;
    }
  `]
})
export class LoginComponent {}