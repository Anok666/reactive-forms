import { Routes } from '@angular/router';
import { ClientCreatePageComponent } from './features/client-create/pages/client-create-page/client-create-page.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'clients/create' },
  { path: 'clients/create', component: ClientCreatePageComponent },
];
