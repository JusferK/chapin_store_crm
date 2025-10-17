import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministratorRoutingModule } from './administrator-routing.module';
import { ListAdministratorComponent } from './pages/list-administrator/list-administrator.component';
import { AdministratorResolver } from './resolver/get-all-admin.resolver';
import { PrimengModule } from '../primeng/primeng.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IMaskDirective } from 'angular-imask';
import { AdministratorFormComponent } from './components/administrator-form/administrator-form.component';


@NgModule({
  declarations: [
    ListAdministratorComponent,
    AdministratorFormComponent,
  ],
  imports: [
    CommonModule,
    AdministratorRoutingModule,
    PrimengModule,
    FormsModule,
    ReactiveFormsModule,
    IMaskDirective,
  ],
  providers: [
    AdministratorResolver,
  ],
})
export class AdministratorModule { }
