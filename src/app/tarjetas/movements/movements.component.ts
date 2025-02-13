import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { GiftCard } from '../../models/gift-card.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-movements',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './movements.component.html',
  styleUrls: ['./movements.component.css']
})
export class MovementsComponent implements OnInit {
  tarjetas: GiftCard[] = [];
  movimientos: { company: string; date: string; description: string; amount: number }[] = [];

  constructor(private authService: AuthService,private router: Router) {}

  ngOnInit() {
    this.cargarMovimientosDesdeLocalStorage();
    this.cargarMovimientosDesdeAPI();
  }

  private cargarMovimientosDesdeLocalStorage() {
    const tarjetasGuardadas = localStorage.getItem('tarjetas');
    if (tarjetasGuardadas) {
      const tarjetas: GiftCard[] = JSON.parse(tarjetasGuardadas);
      this.procesarMovimientos(tarjetas);
    }
  }

  private cargarMovimientosDesdeAPI() {
    this.authService.getTarjetas().subscribe(
      tarjetas => this.procesarMovimientos(tarjetas),
      error => console.error('Error cargando tarjetas desde API:', error)
    );
  }

  private procesarMovimientos(tarjetas: GiftCard[]) {
    if (!tarjetas || tarjetas.length === 0) {
      console.warn('No se encontraron tarjetas.');
      return;
    }

    this.tarjetas = tarjetas;
    this.movimientos = [];

    tarjetas.forEach(tarjeta => {
      if (tarjeta.movements && tarjeta.movements.length > 0) {
        tarjeta.movements.forEach(mov => {
          this.movimientos.push({
            company: tarjeta.company,
            date: mov.date,
            description: mov.description,
            amount: mov.amount
          });
        });
      }
    });

    console.log('Movimientos procesados:', this.movimientos);
  }

  cerrarSesion() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

}
