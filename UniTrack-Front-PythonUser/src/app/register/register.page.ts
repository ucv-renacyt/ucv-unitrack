import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  nombres: string = '';
  apellidos: string = '';
  correo: string = '';
  codigo_estudiante: string = '';
  contrasena: string = '';
  correoA: string = '';
  carrera: string = '';
  ciclo: string = '';
  edad: number | null = null;
  sexo: string = '';

  // Propiedades para el campo de contraseña
  passwordInputType: string = 'password';
  showPasswordIcon: string = 'eye-off-outline';

  constructor(private userService: UserService, private router: Router) {}

  validateEdadInput() {
    if (this.edad !== null) {
      // Asegúrate de que edad no sea null antes de validar
      if (this.edad < 0) {
        this.edad = 0;
      } else if (this.edad > 99) {
        this.edad = 99;
      }
    }
  }

  onSubmit() {
    // Validaciones básicas
    if (
      !this.nombres ||
      !this.apellidos ||
      !this.correo ||
      !this.codigo_estudiante ||
      !this.contrasena ||
      !this.carrera ||
      !this.ciclo ||
      !this.sexo ||
      this.edad === null
    ) {
      alert('Todos los campos son obligatorios');
      return;
    }

    // Validación específica para la edad
    if (this.edad < 0 || this.edad > 99) {
      alert('La edad debe estar entre 0 y 99.');
      return;
    }

    if (this.contrasena.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    // Validar formato de correo institucional
    if (!this.correo.endsWith('@ucvvirtual.edu.pe')) {
      alert(
        'El correo debe ser institucional y terminar en @ucvvirtual.edu.pe'
      );
      return;
    }

    // Si todo está bien, llama al servicio
    this.userService
      .createUser(
        this.nombres,
        this.apellidos,
        this.correo,
        this.codigo_estudiante,
        this.contrasena,
        this.correoA,
        this.carrera,
        this.ciclo,
        this.edad.toString(), // Revertido a string
        this.sexo
      )
      .subscribe(
        (response: any) => {
          console.log('Usuario registrado con éxito', response);
          this.router.navigate(['/login']);
        },
        (error: any) => {
          console.error('Error al registrar el usuario', error);
          let errorMessage =
            'Error al registrar el usuario. Por favor, intente de nuevo.';
          if (error.error && error.error.message) {
            if (Array.isArray(error.error.message)) {
              errorMessage = error.error.message.join('\n');
            } else {
              errorMessage = error.error.message;
            }
          }
          alert(errorMessage);
        }
      );
  }

  ngOnInit() {}

  // Función para alternar la visibilidad de la contraseña
  togglePasswordVisibility() {
    if (this.passwordInputType === 'password') {
      this.passwordInputType = 'text';
      this.showPasswordIcon = 'eye-outline';
    } else {
      this.passwordInputType = 'password';
      this.showPasswordIcon = 'eye-off-outline';
    }
  }
}
