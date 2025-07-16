import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  nombres: string = '';
  apellidos: string = '';
  correo: string = '';
  edad: string= ''; 
  sexo: string= ''; 
  contrasena: string = '';
  isSubmitting = false; // Para prevenir envío doble
  showPassword: boolean = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastController: ToastController
  ) { }

  onSubmit() {
  if (this.isSubmitting) return; // Previene doble envío
  this.isSubmitting = true;

  // Validaciones básicas
  if (
    !this.nombres ||
    !this.apellidos ||
    !this.correo ||
    !this.contrasena ||
    !this.edad ||
    !this.sexo
  ) {
    this.presentToast('Todos los campos son obligatorios');
    this.isSubmitting = false;
    return;
  }
  
  // Validar formato de correo institucional
  const correoRegex = /^[a-zA-Z0-9._%+-]+@ucvvirtual\.edu\.pe$/;
  if (!correoRegex.test(this.correo)) {
    this.presentToast('El correo debe ser institucional y válido');
    this.isSubmitting = false;
    return;
  }

  // Validar longitud máxima de campos
  if (this.nombres.length > 50 || this.apellidos.length > 50) {
    this.presentToast('Nombre y apellido no deben superar 50 caracteres');
    this.isSubmitting = false;
    return;
  }
  if (this.correo.length > 100) {
    this.presentToast('El correo no debe superar 100 caracteres');
    this.isSubmitting = false;
    return;
  }
  if (this.contrasena.length < 6) {
    this.presentToast('La contraseña debe tener al menos 6 caracteres');
    this.isSubmitting = false;
    return;
  }
  if (this.contrasena.length > 50) {
    this.presentToast('La contraseña no debe superar 50 caracteres');
    this.isSubmitting = false;
    return;
  }

  // Si todo está bien, llama al servicio
  this.userService.createAdmin(
    this.nombres,
    this.apellidos,
    this.correo,
    this.contrasena,
    this.edad,
    this.sexo
  ).subscribe(
    (response: any) => {
      if (response.access_token) {
        const userData = {
          nombres: this.nombres,
          apellidos: this.apellidos,
          correo: this.correo,
          edad: this.edad,
          sexo: this.sexo,
          idAdmin: response.idAdmin
        };
        
        this.userService.setCurrentUser(userData, response.access_token);
        
        this.presentToast('Administrador registrado con éxito', 'success');
        this.router.navigate(['/home']); // Redirigir al dashboard o página principal
      } else {
        this.presentToast('Error en el registro: respuesta inesperada del servidor');
      }
      this.isSubmitting = false;
    },
    (error: any) => {
      console.error('Error en el registro:', error);
      const errorMessage = error.error?.message || 'Error al registrar el administrador';
      this.presentToast(errorMessage);
      this.isSubmitting = false;
    }
  );
}

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color,
      position: 'bottom'
    });
    await toast.present();
  }
  ngOnInit() {
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
