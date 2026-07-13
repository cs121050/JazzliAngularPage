import { Routes } from '@angular/router';
import { DownloadComponent } from './pages/download/download.component';
import { LoginComponent } from './pages/login/login.component';
import { ShopComponent } from './pages/shop/shop.component';
import { AboutComponent } from './pages/about/about.component';
import { ChangePasswordComponent } from './pages/change-password/change-password.component';
import { AdminComponent } from './pages/admin/admin.component';
import { UserPanelComponent } from './components/user-panel/user-panel.component';
import { SettingsComponent } from './components/settings/settings.component';


export const routes: Routes = [
  { path: '', redirectTo: 'download', pathMatch: 'full' },
  { path: 'download', component: DownloadComponent },
  { path: 'login', component: LoginComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'shop', component: ShopComponent },
  { path: 'about', component: AboutComponent },
  { path: 'user-panel', component: UserPanelComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: 'download' }
];