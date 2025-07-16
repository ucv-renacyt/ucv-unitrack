import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.page.html',
  styleUrls: ['./historial.page.scss'],
})
export class HistorialPage implements OnInit {
  nombrecompleto: string = '';
  reportes: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getProfile().subscribe({
      next: (data) => {
        this.nombrecompleto = `${data.nombres} ${data.apellidos}`;
        this.userService.getHistory(data.idUsuario).subscribe({
          next: (historyData) => {
            this.reportes = historyData.map((item: any) => ({
              fecha: new Date(item.r_fecha).toLocaleDateString('es-ES'),
              hora: item.r_hora,
              modo: item.r_modo,
            }));
          },
          error: (historyError) => {
            console.error(
              'Error al obtener el historial del usuario:',
              historyError
            );
          },
        });
      },
      error: (error) => {
        console.error('Error al obtener el perfil del usuario:', error);
      },
    });
  }
}
