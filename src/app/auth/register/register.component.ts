import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth, createUserWithEmailAndPassword, UserCredential } from '@angular/fire/auth';
import { from } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, RouterLinkActive],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  private auth = inject(Auth);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  formularioRegistro: FormGroup;

  constructor() {
    this.formularioRegistro = this.fb.group({
      nombreC: ['', Validators.required],
      emailC: ['', [Validators.required, Validators.email]],
      contrasenaC: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasenaC: ['', Validators.required]
    });
  }

  registrarUsuario() {
    const { emailC, contrasenaC, confirmarContrasenaC } = this.formularioRegistro.value;

    if (contrasenaC !== confirmarContrasenaC) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!emailC || !contrasenaC) {
      alert("Por favor, complete todos los campos.");
      return;
    }

    from(createUserWithEmailAndPassword(this.auth, emailC, contrasenaC))
      .subscribe({
        next: (userCredential: UserCredential) => {
          console.log("Usuario registrado:", userCredential.user);
          alert("Registro exitoso");
          this.router.navigate(['/tarjetas']);
        },
        error: (err) => {
          console.error("Error en el registro", err);
          alert("Error al registrar el usuario: " + err.message);
        }
      });
  }
}
