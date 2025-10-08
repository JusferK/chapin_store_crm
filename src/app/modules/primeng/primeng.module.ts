import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
  ],
  exports: [
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
  ],
})
export class PrimengModule { }
