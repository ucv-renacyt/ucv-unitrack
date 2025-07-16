import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {
  editando: boolean = false;
  nombres: string = '';
  apellidos: string = '';
  nombrecompleto: string = '';
  codigo_estudiante: string = '';
  carreraE: string = '';
  cicloE: string = '';
  edadE: string = '';
  sexoE: string = '';
  correoE: string = '';
  correoA: string = '';

  constructor(private userService: UserService) {}

  ciclos: string[] = [
    'I',
    'II',
    'III',
    'IV',
    'V',
    'VI',
    'VII',
    'VIII',
    'IX',
    'X',
    'XI',
    'XII',
  ];

  carreras: string[] = [
    'Administración de Empresas',
    'Administración en Turismo y Hotelería',
    'Administración y Gestión Pública',
    'Administración y Negocios Internacionales',
    'Arquitectura',
    'Artes & Diseño Gráfico Empresarial',
    'Ciencias de la Comunicación',
    'Ciencias del Deporte',
    'Contabilidad',
    'Derecho',
    'Economía',
    'Educación Inicial',
    'Educación Primaria',
    'Enfermería',
    'Estomatología',
    'Ingeniería Agroindustrial',
    'Ingeniería Ambiental',
    'Ingeniería Civil',
    'Ingeniería de Ciencia de Datos',
    'Ingeniería de Minas',
    'Ingeniería de Sistemas',
    'Ingeniería Empresarial',
    'Ingeniería en Ciberseguridad',
    'Ingeniería Industrial',
    'Ingeniería Mecánica Eléctrica',
    'Medicina',
    'Nutrición',
    'Psicología',
    'Tecnología Médica en Laboratorio Clínico y Anatomía Patológica',
    'Traducción e Interpretación',
  ];

  validarEdad() {
    const edad = Number(this.edadE);
    if (edad < 1) this.edadE = '1';
    if (edad > 120) this.edadE = '120';
  }
  validarTexto(input: string): string {
    const regex = /^[a-zA-ZÁÉÍÓÚáéíóúÑñ\s@.\d]+$/; // letras, espacios, @, ., dígitos
    return regex.test(input) ? input : '';
  }

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (user) => {
        if (user) {
          this.nombres = user.nombres;
          this.apellidos = user.apellidos;
          this.nombrecompleto = `${user.nombres} ${user.apellidos}`;
          this.codigo_estudiante = user.codigoEstudiante;
          this.carreraE = user.carrera;
          this.cicloE = user.ciclo;
          this.edadE = user.edad;
          this.sexoE = user.sexo;
          this.correoE = user.correo;
          this.correoA = user.correoA;
        }
      },
      error: (err) => {
        console.error('Error fetching profile:', err);
        // Handle error, e.g., redirect to login or show an alert
      },
    });
  }

  toggleEditarPerfil() {
    this.editando = !this.editando;
    if (!this.editando) {
      console.log('Guardando cambios...');
      this.userService
        .updateProfile({
          nombres: this.validarTexto(this.nombres),
          apellidos: this.validarTexto(this.apellidos),
          correo: this.correoE,
          codigoEstudiante: this.codigo_estudiante,
          correoA: this.validarTexto(this.correoA),
          carrera: this.carreraE,
          ciclo: this.cicloE,
          edad: this.edadE,
          sexo: this.sexoE,
        })
        .subscribe({
          next: (response) => {
            console.log('Perfil actualizado:', response);
            this.ngOnInit(); // Recargar los datos del perfil después de la actualización
          },
          error: (err) => {
            console.error('Error actualizando perfil:', err);
            // Handle error, e.g., show error message
          },
        });
    }
  }
}
