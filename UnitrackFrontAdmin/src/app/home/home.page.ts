import { Component, OnInit } from '@angular/core';
import { FlaskService } from '../services/flask.service';
import { UserService } from '../services/user.service';
import { Reporte } from '../services/reporte';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { InputCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  reportes: Reporte[] = []; // Utiliza la interfaz Reporte para definir el tipo de reportes
  verificationResult: string = '';
  nombres: string = '';
  apellidos: string = '';
  currentUser: any;
  codigo: string = '';
  correo: string = '';
  edad: string = '';
  sexo: string = '';
  qrLeido: string = '';
  isDisable : boolean = true;
  idAdmin: number = 0;
  constructor(
    private userService: UserService,
    private flaskservice: FlaskService,
    private alertController: AlertController,
    private router: Router,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.currentUser = this.userService.getCurrentUser();
    var token = localStorage.getItem('access_token');
    if (!token) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.userService.getCurrentUser();
    if (this.currentUser) {
      this.nombres = this.currentUser.nombres;
      this.apellidos = this.currentUser.apellidos;
      this.codigo = this.currentUser.codigo_admin;
      this.correo = this.currentUser.correo;
      this.edad = this.currentUser.edad;
      this.sexo = this.currentUser.sexo;
      this.idAdmin = this.currentUser.idAdmin;
    }
  }

  verifyQR(qrLeido: string) {
    this.flaskservice.verifyQR(qrLeido).subscribe(
      (result) => {
        // Maneja la respuesta de verificación
        this.verificationResult = result.verified
          ? '¡Verificación correcta, puede ingresar!'
          : '¡ERROR EN LA VERIFICACIÓN!';
        this.showAlert();
      },
      (error) => {
        this.verificationResult = 'Error verificando QR';
        this.showAlert();
      }
    );
  }

  async showAlert() {
    if (this.verificationResult) {
      const alert = await this.alertController.create({
        header: 'Verificación',
        message: this.verificationResult,
        buttons: ['Aceptar'],
      });

      await alert.present();
    }
  }

  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as HTMLIonMenuElement).open();
    }
  }

  editUser() {
    this.isDisable = !this.isDisable;
  }

  saved(){
    this.userService.editAdmin(this.idAdmin, this.correo, this.edad, this.sexo).subscribe(
      (response) => {
        console.log('Usuario editado correctamente:', response);
        this.isDisable = !this.isDisable;
        localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
        this.presentToast('Administrador editado correctamente', 'success');
      },
      (error) => {
        console.error('Error al editar el usuario:', error);
      }
    );
  }

  onChangeEmail(email: InputCustomEvent){
    this.correo = email.detail.value || '';
    this.currentUser.correo = this.correo;
  }

  onChangeAge(age: InputCustomEvent){
    this.edad = age.detail.value || '';
    this.currentUser.edad = this.edad;
  }

  onChangeSex(event: any){
    this.sexo = event.detail.value || '';
    this.currentUser.sexo = this.sexo;
  }

  async presentToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      color: color
    });
    toast.present();
  }
}
