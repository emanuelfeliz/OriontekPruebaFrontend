import { Routes } from '@angular/router';
import { ClientesListComponent } from './components/clientes-list/clientes-list.component';

export const routes: Routes = [
    { path: '', redirectTo: 'clients', pathMatch: 'full' }, 
    { path: 'clients', component: ClientesListComponent }
  ];
