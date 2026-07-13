import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './user-panel.component.html',
  styleUrls: ['./user-panel.component.css']
})
export class UserPanelComponent {
  changePasswordForm: FormGroup;
  showPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    if (newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ 'passwordMismatch': true });
      return { 'passwordMismatch': true };
    }
    return null;
  }

  togglePasswordVisibility(field: string) {
    if (field === 'current') {
      this.showPassword = !this.showPassword;
    } else if (field === 'new') {
      this.showNewPassword = !this.showNewPassword;
    } else if (field === 'confirm') {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  onChangePassword() {
    this.successMessage = '';
    this.errorMessage = '';

    if (this.changePasswordForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly';
      return;
    }

    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      try {
        const { currentPassword, newPassword } = this.changePasswordForm.value;
        
        // TODO: Replace with actual API call
        // Example: this.authService.changePassword(currentPassword, newPassword).subscribe(...)
        
        this.successMessage = 'Password changed successfully!';
        this.changePasswordForm.reset();
        this.isLoading = false;
      } catch (error) {
        this.errorMessage = 'Failed to change password. Please try again.';
        this.isLoading = false;
      }
    }, 1500);
  }

  clearMessages() {
    this.successMessage = '';
    this.errorMessage = '';
  }
}
