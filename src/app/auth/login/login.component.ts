import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  emailC = new FormControl('', { nonNullable: true });
  contrasenaC = new FormControl('', { nonNullable: true });

  dataUsuario: { email: string; password: string } | undefined;
  loading = true;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.router.navigate(['/tarjetas']);
      }
      this.loading = false;
    });
  }

  iniciarSesion() {
    const email = this.emailC.value;
    const password = this.contrasenaC.value;

    if (!email || !password) {
      alert("Por favor, ingresa un correo y una contraseña.");
      return;
    }

    this.authService.login(email, password).subscribe({
      next: (userCredential) => {
        console.log("Usuario autenticado:", userCredential);
        alert("Bienvenido(a)");
        this.router.navigate(['/tarjetas']);
      },
      error: (error) => {
        console.error('Error de autenticación', error);
        alert("Error en sus credenciales, intenta nuevamente");
      }
    });
  }

  resgistrarUsuario() {
    this.dataUsuario = {
      "email": this.emailC.value,
      "password": this.contrasenaC.value
    };
  }
}
