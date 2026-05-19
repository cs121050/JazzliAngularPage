import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../components/layout/layout.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="shop-page">
        <h1>Shop</h1>
        <p>Dummy page - Jazzli Shop</p>
      </div>
    </app-layout>
  `,
  styles: [`
    .shop-page {
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
export class ShopComponent {}