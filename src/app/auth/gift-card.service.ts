import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GiftCard } from '../models/gift-card.model';

@Injectable({
  providedIn: 'root'
})
export class GiftCardService {
  private tarjetasSubject = new BehaviorSubject<GiftCard[]>(this.obtenerTarjetasDesdeLocalStorage());
  tarjetas$: Observable<GiftCard[]> = this.tarjetasSubject.asObservable();

  constructor() {}

  private obtenerTarjetasDesdeLocalStorage(): GiftCard[] {
    const tarjetasGuardadas = localStorage.getItem('tarjetas');
    return tarjetasGuardadas ? JSON.parse(tarjetasGuardadas) : [];
  }

  private guardarTarjetasEnLocalStorage(tarjetas: GiftCard[]) {
    localStorage.setItem('tarjetas', JSON.stringify(tarjetas));
    this.tarjetasSubject.next(tarjetas); 
  }

  getTarjetas(): Observable<GiftCard[]> {
    return this.tarjetas$;
  }

  agregarTarjeta(nuevaTarjeta: GiftCard) {
    const tarjetas = this.obtenerTarjetasDesdeLocalStorage();
    tarjetas.push(nuevaTarjeta);
    this.guardarTarjetasEnLocalStorage(tarjetas);
  }

  createBatch(giftCards: GiftCard[]) {
    const tarjetas = this.obtenerTarjetasDesdeLocalStorage();
    tarjetas.push(...giftCards);
    this.guardarTarjetasEnLocalStorage(tarjetas);
  }

  eliminarTarjeta(index: number) {
    const tarjetas = this.obtenerTarjetasDesdeLocalStorage();
    tarjetas.splice(index, 1);
    this.guardarTarjetasEnLocalStorage(tarjetas);
  }
}
