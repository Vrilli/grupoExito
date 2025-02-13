import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-lote',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './lote.component.html',
  styleUrls: ['./lote.component.css']
})
export class LoteComponent implements OnInit {
  batchForm: FormGroup;
  lotesGuardados: any[] = [];
  cantidadTarjetas = 1;
  loading = true;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.batchForm = this.fb.group({
      tarjetas: this.fb.array([])
    });
  }

  ngOnInit() {
    this.cargarLotesDesdeLocalStorage();
    this.generarTarjetasIniciales();
    this.loading = false;
  }

  get tarjetas(): FormArray {
    return this.batchForm.get('tarjetas') as FormArray;
  }

  generarTarjetasIniciales() {
    this.tarjetas.clear();
    for (let i = 0; i < this.cantidadTarjetas; i++) {
      this.agregarTarjeta();
    }
  }

  generarNumeroTarjeta(): string {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  }

  agregarTarjeta() {
    const tarjetaForm = this.fb.group({
      numeroTarjeta: [this.generarNumeroTarjeta(), Validators.required],
      company: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]],
      imageUrl: ['', Validators.required]
    });

    this.tarjetas.push(tarjetaForm);
  }

  eliminarTarjeta(index: number) {
    if (this.tarjetas.length > 1) {
      this.tarjetas.removeAt(index);
    }
  }

  enviarTarjetas() {
    if (this.batchForm.valid) {
      this.lotesGuardados = [...this.lotesGuardados, {
        id: this.lotesGuardados.length + 1,
        fecha: new Date().toLocaleString(),
        tarjetas: [...this.batchForm.value.tarjetas]
      }];
      alert('Lote guardado con éxito');
      this.batchForm.reset();
      this.generarTarjetasIniciales();
    }
  }
  
  private guardarLotesEnLocalStorage() {
    localStorage.setItem('lotesGuardados', JSON.stringify(this.lotesGuardados));
  }

  private cargarLotesDesdeLocalStorage() {
    const lotesGuardados = localStorage.getItem('lotesGuardados');
    if (lotesGuardados) {
      this.lotesGuardados = JSON.parse(lotesGuardados);
    }
  }

  cerrarSesion() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
