import { Component } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { UserService } from './services/user.service'; // <-- Agrega esta línea
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  hideMenu: boolean = false;

  constructor(
    private menuCtrl: MenuController,
    private router: Router,
    private userService: UserService,
    private activatedRoute: ActivatedRoute
  ) {
    this.setupMenu();
    this.router.events.pipe(
      filter((event: any): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const currentRoute = event.urlAfterRedirects;
      this.hideMenu = currentRoute.includes('/login') || currentRoute.includes('/register') || currentRoute.includes('/correo');
    });
  }

  private setupMenu() {
    // Habilitar menú al iniciar
    this.menuCtrl.enable(true, 'main-menu');

    // Cerrar menú al navegar
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.menuCtrl.close('main-menu');
      }
    });
  }

  // Método para cerrar sesión (llamado desde el ítem del menú)
  // Método para cerrar sesión (llamado desde el ítem del menú)
  async logout() {
    try {
      await this.userService.logoutUser().toPromise().catch(() => {
        console.log('No se pudo cerrar sesión en el servidor (puede ser normal)');
      });

      this.userService.setCurrentUser(null, null);
      localStorage.clear();
      await this.menuCtrl.close('main-menu');
      await this.router.navigate(['/login'], { replaceUrl: true });
      window.location.reload();
    } catch (error) {
      console.error('Error durante el cierre de sesión:', error);
      this.userService.setCurrentUser(null, null);
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}