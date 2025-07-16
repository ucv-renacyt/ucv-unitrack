import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-verificar',
  templateUrl: './verificar.page.html',
  styleUrls: ['./verificar.page.scss'],
})
export class VerificarPage implements OnInit {
  verificationCode: string = '';
  userEmail: string = '';

  constructor(
    private navCtrl: NavController,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'] || '';
    });
  }

  async verifyCode() {
    if (!this.verificationCode) {
      console.log('Please enter the verification code.');
      return;
    }

    // In a real application, you would send the email and code to the backend
    // to verify the code. For this example, we'll just navigate.
    console.log('Verifying code:', this.verificationCode);
    this.navCtrl.navigateForward('/contrasena', {
      queryParams: { email: this.userEmail, code: this.verificationCode },
    });
  }

  async closeModal() {
    this.navCtrl.navigateRoot('/login');
  }
}
