import { inject, Injectable } from "@angular/core";
import { Auth, signInWithEmailAndPassword, signOut, UserCredential, onAuthStateChanged, User, authState } from '@angular/fire/auth';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { GiftCard } from "../models/gift-card.model";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private auth = inject(Auth);
  private tarjetas: GiftCard[] = [];
  private tarjetasSubject = new BehaviorSubject<GiftCard[]>(this.tarjetas);
  private userSubject = new BehaviorSubject<User | null>(null);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.userSubject.next(user);
    });
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password).then((userCredential) => {
        this.userSubject.next(userCredential.user);
        return userCredential;
      })
    );
  }
  logout(): Observable<void> {
    return from(
      signOut(this.auth).then(() => {
        this.userSubject.next(null); 
      })
    );
  }
  

  isAuthenticated(): boolean {
    return this.userSubject.value !== null;
  }

  getUser(): Observable<User | null> {
    return authState(this.auth);
  }
  
  guardarTarjetas(tarjetas: GiftCard[]) {
    localStorage.setItem('tarjetas', JSON.stringify(tarjetas));
    this.tarjetasSubject.next(tarjetas);
  }

  getTarjetas(): Observable<GiftCard[]> {
    return this.tarjetasSubject.asObservable();
  }

  agregarTarjeta(nuevaTarjeta: GiftCard) {
    this.tarjetas.push(nuevaTarjeta);
    this.tarjetasSubject.next(this.tarjetas);
  }
}
