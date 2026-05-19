import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from '../../components/layout/layout.component';

@Component({
  selector: 'app-download',
  standalone: true,
  imports: [CommonModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="download-page">
        <h1>Download Jazzli</h1>
        <p>Get the Jazzli app for your Android device</p>
        
        <a href="https://jazzli-apk-host-production.up.railway.app/jazzli1.apk" class="download-button" download>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download APK
        </a>
      </div>
    </app-layout>
  `,
  styles: [`
    .download-page {
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
      background: linear-gradient(90deg, #F0060B 0%, #CC26D5 50%, #7702FF 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    p {
      font-size: 1.125rem;
      color: #666;
      margin-bottom: 2rem;
    }

    .download-button {
      display: inline-flex;
      align-items: center;
      gap: 0.75rem;
      background: linear-gradient(90deg, #F0060B 0%, #CC26D5 50%, #7702FF 100%);
      color: white;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      cursor: pointer;
      border: none;
    }

    .download-button:hover {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(240, 6, 11, 0.3);
    }

    @media (max-width: 768px) {
      h1 {
        font-size: 1.875rem;
      }

      .download-button {
        padding: 0.75rem 1.5rem;
      }
    }
  `]
})
export class DownloadComponent {}