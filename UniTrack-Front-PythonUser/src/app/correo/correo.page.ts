import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
})
export class CorreoPage implements OnInit {
  email: string = '';

  constructor(private userService: UserService, private navCtrl: NavController) {}

  ngOnInit() {}

  async sendVerificationCode() {
    if (!this.email) {
      // Handle empty email case, e.g., show a toast message
      console.log('Please enter your email.');
      return;
    }

    try {
      const response = await this.userService.forgotPassword(this.email).toPromise();
      console.log('Forgot password response:', response);
      // Navigate to the verification page after sending the code
      this.navCtrl.navigateForward('/verificar', { queryParams: { email: this.email } });
    } catch (error) {
      console.error('Error sending verification code:', error);
      // Handle error, e.g., show an alert or toast
    }
  }
}