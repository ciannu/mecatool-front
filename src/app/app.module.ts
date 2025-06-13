import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AppComponent } from './app.component';
import { LayoutComponent } from './components/layout/layout.component';
import { SidebarComponent } from './components/layout/sidebar/sidebar.component';
import { AppRoutingModule } from './app-routing.module';
import { WorkOrdersListComponent } from './components/work-orders/work-orders-list/work-orders-list.component';
import { WorkOrderFormComponent } from './components/work-orders/work-order-form/work-order-form.component';
import { WorkOrderDetailsComponent } from './components/work-orders/work-order-details/work-order-details.component';

@NgModule({
  declarations: [],
  imports: [
    AppComponent,
    LayoutComponent,
    SidebarComponent,
    BrowserModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatButtonModule,
    AppRoutingModule,
    WorkOrdersListComponent,
    WorkOrderFormComponent,
    WorkOrderDetailsComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }