import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LayoutComponent } from '../../components/layout/layout.component';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, LayoutComponent],
  template: `
    <app-layout>
      <div class="admin-container">
        <h1 class="admin-title">Admin Panel</h1>

        <!-- Tabs navigation -->
        <div class="tabs">
          <button
            *ngFor="let tab of tabs"
            class="tab-btn"
            [class.active]="selectedTab === tab.id"
            (click)="selectTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Tab content -->
        <div class="tab-content">
          <!-- Videos -->
          <div *ngIf="selectedTab === 'videos'">
            <h2>Handle Videos</h2>

            <!-- Paragraph: Add Video -->
            <div class="section">
              <h3>Add Video</h3>
              <p>Use this form to manually add a video to the database (dummy).</p>
              <form (ngSubmit)="addVideo()" class="dummy-form">
                <div class="form-group">
                  <label>Title</label>
                  <input type="text" [(ngModel)]="video.title" name="videoTitle" required>
                </div>
                <div class="form-group">
                  <label>URL</label>
                  <input type="url" [(ngModel)]="video.url" name="videoUrl" required>
                </div>
                <div class="form-group">
                  <label>Artist</label>
                  <input type="text" [(ngModel)]="video.artist" name="videoArtist">
                </div>
                <button type="submit" class="btn-primary">Add Video</button>
              </form>
            </div>

            <hr class="separator">

            <!-- Paragraph: Enriched Videos -->
            <div class="section">
              <h3>Enriched Videos</h3>
              <p>Trigger enrichment of video metadata (dummy Python script).</p>
              <button class="btn-secondary" (click)="runPythonScript('enrich_videos')">
                Run Enrichment
              </button>
            </div>

            <hr class="separator">

            <!-- Paragraph: Check URL availability -->
            <div class="section">
              <h3>Check URL Availability</h3>
              <p>Check if video URLs are still accessible (dummy Python script).</p>
              <button class="btn-secondary" (click)="runPythonScript('check_urls')">
                Run URL Check
              </button>
            </div>

            <hr class="separator">

            <!-- Paragraph: Find New URLs -->
            <div class="section">
              <h3>Find New URLs</h3>
              <p>Search for new video URLs from sources (dummy Python script).</p>
              <button class="btn-secondary" (click)="runPythonScript('find_new_urls')">
                Find New URLs
              </button>
            </div>
          </div>

          <!-- Artist -->
          <div *ngIf="selectedTab === 'artist'">
            <h2>Handle Artist</h2>

            <div class="section">
              <h3>Add Artist</h3>
              <form (ngSubmit)="addArtist()" class="dummy-form">
                <div class="form-group">
                  <label>Artist Name</label>
                  <input type="text" [(ngModel)]="artist.name" name="artistName" required>
                </div>
                <div class="form-group">
                  <label>Genre</label>
                  <input type="text" [(ngModel)]="artist.genre" name="artistGenre">
                </div>
                <button type="submit" class="btn-primary">Add Artist</button>
              </form>
            </div>

            <hr class="separator">

            <div class="section">
              <h3>Enriched Artists Data</h3>
              <p>Fetch and enrich artist information (dummy Python script).</p>
              <button class="btn-secondary" (click)="runPythonScript('enrich_artists')">
                Enrich Artists
              </button>
            </div>
          </div>

          <!-- Albums -->
          <div *ngIf="selectedTab === 'albums'">
            <h2>Handle Albums</h2>

            <div class="section">
              <h3>Find Albums (Artist – Album Relation)</h3>
              <p>Discover albums for a given artist (dummy).</p>
              <form (ngSubmit)="findAlbums()" class="dummy-form">
                <div class="form-group">
                  <label>Artist Name</label>
                  <input type="text" [(ngModel)]="albumQuery.artist" name="albumArtist" required>
                </div>
                <button type="submit" class="btn-primary">Find Albums</button>
              </form>
              <div *ngIf="albumResults.length" class="results">
                <h4>Results:</h4>
                <ul>
                  <li *ngFor="let alb of albumResults">{{ alb }}</li>
                </ul>
              </div>
            </div>

            <hr class="separator">

            <div class="section">
              <h3>Enriched Albums</h3>
              <p>Enrich album metadata (dummy Python script).</p>
              <button class="btn-secondary" (click)="runPythonScript('enrich_albums')">
                Enrich Albums
              </button>
            </div>
          </div>
        </div>
      </div>
    </app-layout>
  `,
  styles: `
    .admin-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 1rem 0;
    }

    .admin-title {
      font-size: 2rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
      color: #123456;
    }

    .tabs {
      display: flex;
      gap: 0.5rem;
      border-bottom: 2px solid #eee;
      margin-bottom: 2rem;
    }

    .tab-btn {
      padding: 0.75rem 1.5rem;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      color: #666;
      transition: all 0.2s;
    }
    .tab-btn:hover {
      color: #333;
    }
    .tab-btn.active {
      color: #CC26D5;
      border-bottom-color: #CC26D5;
    }

    .tab-content {
      padding: 1rem 0;
    }

    .section {
      margin-bottom: 2rem;
    }
    .section h3 {
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
      color: #222;
    }
    .section p {
      color: #666;
      margin-bottom: 1rem;
    }

    .separator {
      border: 0;
      border-top: 2px dashed #ccc;
      margin: 2rem 0;
    }

    .dummy-form {
      background: #f9f9f9;
      padding: 1rem;
      border-radius: 0.5rem;
      max-width: 400px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 0.25rem;
      font-size: 0.9rem;
    }
    .form-group input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 0.25rem;
      font-size: 1rem;
    }

    .btn-primary {
      background: linear-gradient(90deg, #F0060B, #CC26D5);
      color: white;
      border: none;
      padding: 0.5rem 1.5rem;
      border-radius: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
      transition: opacity 0.2s;
    }
    .btn-primary:hover {
      opacity: 0.85;
    }

    .btn-secondary {
      background: #eee;
      color: #333;
      border: 1px solid #ccc;
      padding: 0.5rem 1.5rem;
      border-radius: 0.25rem;
      font-size: 1rem;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-secondary:hover {
      background: #ddd;
    }

    .results {
      margin-top: 1rem;
      background: #f5f5f5;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
    }
    .results ul {
      margin: 0.5rem 0 0;
      padding-left: 1.5rem;
    }
  `
})
export class AdminComponent implements OnInit {
  tabs = [
    { id: 'videos', label: '📹 Handle Videos' },
    { id: 'artist', label: '🎤 Handle Artist' },
    { id: 'albums', label: '💿 Handle Albums' }
  ];
  selectedTab = 'videos';

  // Video form
  video = { title: '', url: '', artist: '' };

  // Artist form
  artist = { name: '', genre: '' };

  // Album query
  albumQuery = { artist: '' };
  albumResults: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if user is admin; if not, redirect to home
    // We'll also use a guard, but this is extra safety.
    if (!this.authService.currentUser || this.authService.currentUser.role !== 'admin') {
      this.router.navigate(['/']);
    }
  }

  selectTab(tabId: string) {
    this.selectedTab = tabId;
  }

  // Dummy methods
  addVideo() {
    console.log('Dummy: Add video', this.video);
    alert(`Dummy: Added video "${this.video.title}"`);
    this.video = { title: '', url: '', artist: '' };
  }

  addArtist() {
    console.log('Dummy: Add artist', this.artist);
    alert(`Dummy: Added artist "${this.artist.name}"`);
    this.artist = { name: '', genre: '' };
  }

  findAlbums() {
    console.log('Dummy: Find albums for artist', this.albumQuery.artist);
    // Simulate results
    this.albumResults = [
      `Album 1 (${this.albumQuery.artist})`,
      `Album 2 (${this.albumQuery.artist})`,
      `Album 3 (${this.albumQuery.artist})`
    ];
    alert(`Dummy: Found 3 albums for "${this.albumQuery.artist}"`);
  }

  runPythonScript(scriptName: string) {
    console.log(`Dummy: Running Python script: ${scriptName}`);
    alert(`Dummy: Python script "${scriptName}" executed. Check console for logs.`);
    // In the future, you can call your backend API here.
  }
}