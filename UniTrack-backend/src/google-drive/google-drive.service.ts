import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';


@Injectable()
export class GoogleDriveService {
  private drive;
  private SCOPES = ['https://www.googleapis.com/auth/drive.file'];
  private FOLDER_NAME = 'QRCodes';
  private folderId: string;

  constructor() {
    this.initializeGoogleDrive();
  }

  private async initializeGoogleDrive() {
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error(
        'GOOGLE_PRIVATE_KEY is not defined in environment variables',
      );
    }
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      projectId: process.env.GOOGLE_PROJECT_ID,
      scopes: this.SCOPES,
    });

    this.drive = google.drive({ version: 'v3', auth });
    await this.ensureQRCodesFolderExists();
  }

  private async ensureQRCodesFolderExists() {
    try {
      const response = await this.drive.files.list({
        q: `name='${this.FOLDER_NAME}' and mimeType='application/vnd.google-apps.folder'`,
        fields: 'files(id)',
      });

      if (response.data.files.length > 0) {
        this.folderId = response.data.files[0].id;
      } else {
        const folderMetadata = {
          name: this.FOLDER_NAME,
          mimeType: 'application/vnd.google-apps.folder',
        };

        const folder = await this.drive.files.create({
          requestBody: folderMetadata,
          fields: 'id',
        });

        this.folderId = folder.data.id;
      }
    } catch (error) {
      console.error('Error al crear/verificar carpeta en Google Drive:', error);
      throw error;
    }
  }



  async uploadQRCodeFromBuffer(bufferStream: any, fileName: string): Promise<string> {
    try {
      const fileMetadata = {
        name: fileName,
        parents: [this.folderId],
      };

      const media = {
        mimeType: 'image/png',
        body: bufferStream,
      };

      const response = await this.drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: 'id,webViewLink',
      });

      // Hacer el archivo público
      await this.drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      // Obtener el enlace público actualizado
      const file = await this.drive.files.get({
        fileId: response.data.id,
        fields: 'webViewLink, webContentLink',
      });

      return file.data.webContentLink || '';
    } catch (error) {
      console.error('Error al subir archivo a Google Drive desde buffer:', error);
      throw error;
    }
  }
}
