import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contrasena',
  templateUrl: './contrasena.page.html',
  styleUrls: ['./contrasena.page.scss'],
})
export class ContrasenaPage implements OnInit {
  newPassword: string = '';
  showPassword = false;
  email: string = '';
  code: string = '';

  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
      this.code = params['code'] || '';
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async resetPassword() {
    if (!this.newPassword || !this.email || !this.code) {
      console.log('Please enter all required fields.');
      return;
    }

    try {
      const response = await this.userService
        .resetPassword(this.email, this.code, this.newPassword)
        .toPromise();
      console.log('Password reset response:', response);
      // Navigate to login page after successful password reset
      this.navCtrl.navigateRoot('/login');
    } catch (error: any) {
      console.error('Error resetting password:', error);
      let errorMessage = 'An unknown error occurred.';
      if (error.error && error.error.message) {
        errorMessage = error.error.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      // You can use an Ionic alert or toast controller here to display the error to the user
      alert(`Error: ${errorMessage}`);
    }
  }
}
