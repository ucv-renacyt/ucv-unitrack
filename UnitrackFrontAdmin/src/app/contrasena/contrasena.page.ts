import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { EnvioCorreoService } from '../services/envio-correo.service';

@Component({
  selector: 'app-contrasena',
  templateUrl: './contrasena.page.html',
  styleUrls: ['./contrasena.page.scss'],
})
export class ContrasenaPage implements OnInit {
  newPassword: string = '';
  isSubmitting = false; // Para prevenir envío doble
  email: string = '';
  code: string = '';

  constructor(
    private userService: EnvioCorreoService,
    private navCtrl: NavController,
    private toastController: ToastController,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
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

  cancelarProceso() {
    localStorage.removeItem('reset_code');
    this.navCtrl.navigateRoot('/login');
  }
  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.email = params['email'] || '';
      this.code = params['code'] || '';
      if (!this.email || !this.code) {
        this.presentToast('Faltan parámetros para restablecer la contraseña.');
        this.navCtrl.navigateRoot('/login');
      }
    });
  }
}
