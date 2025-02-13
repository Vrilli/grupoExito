export interface GiftCard {
  id: number;
  company: string;
  amount: number;
  imageUrl: string;
  movements: { date: string; description: string; amount: number; }[];
}


export interface Movimiento {
    id: string;
    tipo: 'Carga' | 'Compra' | 'Recarga';
    monto: number;
    fecha: string;
}


