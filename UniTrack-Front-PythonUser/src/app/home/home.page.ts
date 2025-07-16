import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NavController, Platform } from '@ionic/angular';
import { BlockchainService } from '../services/blockchain.service';
import { HttpClient } from '@angular/common/http';
import { QrService } from '../services/qr.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  nombrecompleto: string = 'Nombre Completo';
  isEntrada: boolean = true;
  qrCodeUrl: string | null = null;

  constructor(
    private userService: UserService,
    private navCtrl: NavController,
    private blockchainService: BlockchainService,
    private http: HttpClient,
    private qrService: QrService,
    private platform: Platform
  ) {}

  async ngOnInit() {
    await this.userService.loadUserFromPreferences();
    this.userService.getProfile().subscribe({
      next: (user) => {
        if (user) {
          this.userService.setCurrentUser(user);
          this.nombrecompleto = `${user.nombres} ${user.apellidos}`;
          this.loadQrCodeForUser(user.idUsuario);
          this.loadLatestQrType(user.idUsuario);
        }
      },
      error: (err) => {
        console.error('Error fetching profile in home page:', err);
      },
    });
  }

  async loadLatestQrType(idUsuario: number) {
    if (this.platform.is('capacitor') || this.platform.is('cordova')) {
      this.qrService.getLatestQrTypeByUserId(idUsuario).subscribe({
        next: (response) => {
          if (response && response.tipo) {
            this.isEntrada = response.tipo === 'entrada';
          }
        },
        error: (err) => {
          console.error('Error fetching latest QR type:', err);
        },
      });
    }
  }

  onToggleChange() {
    // Logic to handle the toggle change
    console.log('Toggle changed. isEntrada:', this.isEntrada);
  }

  async generarQR() {
    await this.userService.loadUserFromPreferences();
    const currentUser = this.userService.currentUser;
    if (currentUser && currentUser.idUsuario) {
      const data = {
        tipo: this.isEntrada ? 'entrada' : 'salida',
        timestamp: new Date().toISOString(),
      };
      this.blockchainService.addBlock(data, currentUser.idUsuario).subscribe({
        next: async (response) => {
          console.log('Block added and QR generated:', response);
          if (response && response.qrUrl) {
            this.qrCodeUrl = this.transformGoogleDriveUrl(response.qrUrl);
            console.log('QR Code URL set:', this.qrCodeUrl);
          } else {
            console.error('QR URL not received from blockchain service.');
          }
          this.loadQrCodeForUser(currentUser.idUsuario);
        },
        error: (err) => {
          console.error('Error adding block or generating QR:', err);
        },
      });
    } else {
      console.error('User not logged in or idUsuario not found.');
    }
  }

  async loadQrCodeForUser(idUsuario: number) {
    this.qrService.getQrUrlByUserId(idUsuario).subscribe({
      next: (response) => {
        if (response.qrUrl) {
          this.qrCodeUrl = this.transformGoogleDriveUrl(response.qrUrl);
          console.log('QR Code URL set:', this.qrCodeUrl);
        } else {
          this.qrCodeUrl = null;
        }
      },
      error: (err) => {
        console.error('Error fetching QR URL:', err);
        this.qrCodeUrl = null;
      },
    });
  }

  private transformGoogleDriveUrl(originalUrl: string): string {
    // Try to extract file ID from 'id=' parameter
    const idParamMatch = originalUrl.match(/id=([a-zA-Z0-9_-]+)/);
    if (idParamMatch && idParamMatch[1]) {
      const fileId = idParamMatch[1];
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }

    // Try to extract file ID from '/d/FILE_ID/view' format
    const viewPathMatch = originalUrl.match(/\/d\/([a-zA-Z0-9_-]+)\/view/);
    if (viewPathMatch && viewPathMatch[1]) {
      const fileId = viewPathMatch[1];
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }

    // Try to extract file ID from '/file/d/FILE_ID/preview' format
    const filePathMatch = originalUrl.match(
      /\/file\/d\/([a-zA-Z0-9_-]+)\/preview/
    );
    if (filePathMatch && filePathMatch[1]) {
      const fileId = filePathMatch[1];
      return `https://lh3.googleusercontent.com/d/${fileId}`;
    }

    // If no specific Google Drive ID format is found, return the original URL
    // or a default placeholder if preferred.
    return originalUrl;
  }

  async logout() {
    await this.userService.removePreferences('access_token');
    await this.userService.removePreferences('currentUser');
    this.userService.currentUser = null;
    this.navCtrl.navigateRoot('/login');
  }
}
