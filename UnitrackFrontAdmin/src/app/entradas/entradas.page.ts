import { Component, OnInit } from '@angular/core';
import { FlaskService } from '../services/flask.service';
import { UserService } from '../services/user.service';
import { Reporte } from '../services/reporte';
import { ToastController } from '@ionic/angular';
import { EntradaService } from '../services/entradas.service';

@Component({
  selector: 'app-entradas',
  templateUrl: './entradas.page.html',
  styleUrls: ['./entradas.page.scss'],
})
export class EntradasPage implements OnInit {
  reportes: Reporte[] = [];


  constructor(
    private userService: UserService,
    private flaskservice: FlaskService,
    private toastController: ToastController,
    private entradaService: EntradaService
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



  ngOnInit() {
    this.entradaService.entradas().subscribe({
      next: (data) => {
        this.reportes = data;
      },
      error: (error) => {
        this.presentToast(error.message || 'Error al obtener las entradas');
      },
    });
  }
  openMenu() {
    const menu = document.querySelector('ion-menu');
    if (menu) {
      (menu as HTMLIonMenuElement).open();
    }
  }
}
