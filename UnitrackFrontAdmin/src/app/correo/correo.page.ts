import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { EnvioCorreoService } from '../services/envio-correo.service';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
})
export class CorreoPage implements OnInit {
  email: string = '';
  isSubmitting = false;
  sent = false;

  constructor(
    private userService: EnvioCorreoService,
    private router: Router,
    private navCtrl: NavController,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'bottom',
    });
    await toast.present();
  }

  sendVerificationCode() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    // Validar campos
    if (!this.email) {
      this.presentToast('El correo es obligatorio');
      this.isSubmitting = false;
      return;
    }

    const correoRegex = /^[a-zA-Z0-9._%+-]+@ucvvirtual\.edu\.pe$/;
    if (!correoRegex.test(this.email)) {
      this.presentToast('El correo debe ser institucional y válido');
      this.isSubmitting = false;
      return;
    }

    if (this.email.length > 100) {
      this.presentToast('El correo no debe superar 100 caracteres');
      this.isSubmitting = false;
      return;
    }

    this.userService.sendVerificationCodee(this.email).subscribe(
      (response) => {
        console.log('Código enviado:', response);
        if (response && response.message) {
          this.userService.currentEmail = this.email; // Guardar el correo actual
          this.sent = true;
          const codeMatch = response.message.match(/\d{6}/); // Extract the 6-digit code
          const code = codeMatch ? codeMatch[0] : null;

          if (code) {
            setTimeout(() => {
              this.sent = false;
              this.router.navigate(['/verificar'], {
                queryParams: { email: this.email },
              });
            }, 2000);
          } else {
            this.presentToast('No se pudo extraer el código de verificación.');
            this.isSubmitting = false;
          }
          this.isSubmitting = false;
        } else {
          this.presentToast(response.error || 'Error al enviar el código');
          this.isSubmitting = false;
        }
      },
      (error) => {
        this.presentToast(error.message || 'Error al enviar el código');
        this.isSubmitting = false;
      }
    );
  }
}
