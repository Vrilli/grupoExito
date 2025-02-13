import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterModule } from '@angular/router';
import { GiftCard } from '../../models/gift-card.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  tarjetas: GiftCard[] = [];
  nueva: GiftCard = { id: 0, company: '', amount: 0, imageUrl: '', movements: [] };
  loading = true;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (!user) {
        this.router.navigate(['/login']);
      } else {
        const tarjetasGuardadas = localStorage.getItem('tarjetas');
        this.tarjetas = tarjetasGuardadas ? JSON.parse(tarjetasGuardadas) : [];

        if (!tarjetasGuardadas) {
          this.authService.getTarjetas().subscribe(tarjetas => {
            const idsExistentes = new Set(this.tarjetas.map(t => t.id));
            const nuevasTarjetas = tarjetas
              .filter(t => !idsExistentes.has(t.id))
              .map(t => ({ ...t, movements: t.movements || [] }));

            this.tarjetas = [...this.tarjetas, ...nuevasTarjetas];
            this.guardarEnLocalStorage();
          });
        }
      }
      this.loading = false;
    });
  }

  guardarEnLocalStorage() {
    localStorage.setItem('tarjetas', JSON.stringify(this.tarjetas));
  }

  nuevaTarjeta() {
    if (this.nueva.company && this.nueva.amount && this.nueva.imageUrl) {
      const nuevaTarjeta: GiftCard = {
        id: Date.now(),
        company: this.nueva.company,
        amount: this.nueva.amount,
        imageUrl: this.nueva.imageUrl,
        movements: []
      };
      this.tarjetas.push(nuevaTarjeta);
      this.guardarEnLocalStorage();
      this.nueva = { id: 0, company: '', amount: 0, imageUrl: '', movements: [] };
    }
  }

  agregarMovimiento(index: number, descripcion: string, monto: number) {
    const tarjeta = this.tarjetas[index];
    if (monto > 0) {
      if (!tarjeta.movements) {
        tarjeta.movements = [];
      }
      const nuevoMovimiento = {
        date: new Date().toISOString(),
        description: descripcion,
        amount: monto
      };
      tarjeta.movements.push(nuevoMovimiento);
      this.guardarEnLocalStorage();
    }
  }

  gastarSaldo(index: number) {
    const montoAGastar = prompt("Ingrese el monto a gastar:");
    if (montoAGastar) {
      const cantidad = parseFloat(montoAGastar);
      if (isNaN(cantidad) || cantidad <= 0) {
        alert("Ingrese un monto válido.");
        return;
      }
      if (cantidad > this.tarjetas[index].amount) {
        alert("Saldo insuficiente.");
        return;
      }
      this.tarjetas[index].amount -= cantidad;
      if (!this.tarjetas[index].movements) {
        this.tarjetas[index].movements = [];
      }
      this.tarjetas[index].movements.push({
        date: new Date().toISOString(),
        amount: cantidad,
        description: `Gasto realizado de $${cantidad} COP`
      });

      this.guardarEnLocalStorage();
      alert("Gasto registrado exitosamente.");
    }
  }

  editarTarjeta(index: number) {
    const tarjeta = this.tarjetas[index];
    const nombre = prompt('Editar nombre de la tarjeta:', tarjeta.company);
    const monto = prompt('Editar monto:', tarjeta.amount.toString());
    const imageUrl = prompt('Editar URL de la imagen:', tarjeta.imageUrl);

    if (nombre && monto && imageUrl) {
      this.tarjetas[index] = { ...tarjeta, company: nombre, amount: Number(monto), imageUrl };
      this.guardarEnLocalStorage();
    }
  }

  eliminarTarjeta(index: number) {
    this.tarjetas.splice(index, 1);
    this.guardarEnLocalStorage();
  }

  cerrarSesion() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }

  trackById(index: number, tarjeta: GiftCard) {
    return tarjeta.id;
  }
}
