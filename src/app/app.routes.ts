import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { HomeComponent } from './components/home/home.component';
import { ClientsComponent } from './components/clients/clients.component';
import { ClientFormComponent } from './components/clients/client-form/client-form.component';
import { ClientEditComponent } from './components/clients/client-edit/client-edit.component';
import { ClientDetailComponent } from './components/clients/client-detail/client-detail.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { VehicleFormComponent } from './components/vehicles/vehicle-form/vehicle-form.component';
import { VehicleEditComponent } from './components/vehicles/vehicle-edit/vehicle-edit.component';
import { WorkOrdersListComponent } from './components/work-orders/work-orders-list/work-orders-list.component';
import { WorkOrderFormComponent } from './components/work-orders/work-order-form/work-order-form.component';
import { WorkOrderDetailsComponent } from './components/work-orders/work-order-details/work-order-details.component';
import { InventoryItemsComponent } from './components/inventory-items/inventory-items.component';
import { InventoryItemCreateComponent } from './components/inventory-item-create/inventory-item-create.component';
import { InventoryItemEditComponent } from './components/inventory-item-edit/inventory-item-edit.component';
import { MechanicsComponent } from './components/mechanics/mechanics.component';
import { MechanicFormComponent } from './components/mechanics/mechanic-form/mechanic-form.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { UserFormComponent } from './components/users/user-form.component';
import { UsersListComponent } from './components/users/users-list.component';
import { UserEditComponent } from './components/users/user-edit.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'clients/new', component: ClientFormComponent },
      { path: 'clients/:id', component: ClientDetailComponent },
      { path: 'clients/edit/:id', component: ClientEditComponent },
      { path: 'vehicles', component: VehiclesComponent },
      { path: 'vehicles/new', component: VehicleFormComponent },
      { path: 'vehicles/edit/:id', component: VehicleEditComponent },
      { path: 'mechanics', component: MechanicsComponent },
      { path: 'mechanics/new', component: MechanicFormComponent },
      { path: 'mechanics/edit/:id', component: MechanicFormComponent },
      { path: 'users', component: UsersListComponent },
      { path: 'users/new', component: UserFormComponent },
      { path: 'users/edit/:id', component: UserEditComponent },
      {
        path: 'work-orders',
        children: [
          { path: '', component: WorkOrdersListComponent },
          { path: 'new', component: WorkOrderFormComponent },
          { path: ':id', component: WorkOrderDetailsComponent },
          { path: ':id/edit', component: WorkOrderFormComponent },
        ],
      },
      {
        path: 'inventory-items',
        children: [
          { path: '', component: InventoryItemsComponent },
          { path: 'new', component: InventoryItemCreateComponent },
          { path: 'edit/:id', component: InventoryItemEditComponent },
        ],
      },
    ],
  },
  { path: '**', redirectTo: 'login' }
];