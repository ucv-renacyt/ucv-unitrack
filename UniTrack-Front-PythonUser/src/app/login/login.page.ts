import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  correoE: string = '';
  contrasenaE: string = '';
  showPassword: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  async login() {
    if (!this.correoE || !this.contrasenaE) {
      this.presentAlert('Error', 'Por favor, ingrese su correo y contraseña.');
      return;
    }

    this.userService.loginUser(this.correoE, this.contrasenaE)
    .subscribe({
      next: (response) => {
        if (response.success) {
          this.userService.setCurrentUser(response.user);
          this.userService.setPreferences('access_token', response.access_token);
          this.userService.setPreferences('currentUser', JSON.stringify(response.user));
          this.presentAlert('Éxito', 'Inicio de sesión exitoso.');
          this.router.navigate(['/home']); // Redirige a la página principal
        } else {
          this.presentAlert(
            'Error',
            response.error || 'Credenciales incorrectas.'
          );
        }
      },
      error: (err) => {
        console.error('Error en el login:', err);
        this.presentAlert(
          'Error',
          'Ocurrió un error durante el inicio de sesión. Intente de nuevo.'
        );
      },
    });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
