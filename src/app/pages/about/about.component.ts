import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../components/layout/layout.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="about-page">
        <h1>About Us</h1>
        <p>Dummy page - Learn about Jazzli</p>
      </div>
    </app-layout>
  `,
  styles: [`
    .about-page {
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
  `]
})
export class AboutComponent {}