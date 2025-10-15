import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { ListUserComponent } from './pages/list-user/list-user.component';
import { CustomerListResolver } from './resolver/customer-list-resolver.service';
import { Button } from 'primeng/button';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { Toast } from 'primeng/toast';
import { IMaskDirective } from 'angular-imask';


@NgModule({
  declarations: [
    ListUserComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    Button,
    IconField,
    InputIcon,
    InputText,
    ReactiveFormsModule,
    TableModule,
    Toast,
    IMaskDirective
  ],
  providers: [
    CustomerListResolver,
  ],
})
export class CustomerModule { }
