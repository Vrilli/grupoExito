import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ListComponent } from './tarjeta/list/list.component';
import { AuthGuard } from './auth/auth.guard';
import { MovementsComponent } from './tarjetas/movements/movements.component';
import { NgModule } from '@angular/core';
import { LoteComponent } from './tarjetas/lote/lote.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'tarjetas', component: ListComponent, canActivate: [AuthGuard] },
    { path: 'tarjetas/lote', component: LoteComponent, canActivate: [AuthGuard] },
    { path: 'movements/:id', component: MovementsComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'login' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }