export interface IEntrada {
  id: number;
  usuario: string;
  correo: string;
  fecha: string; // formato ISO (puedes usar Date si ya lo parseas)
  hora: string; // formato HH:mm:ss
  modo: string;
}
