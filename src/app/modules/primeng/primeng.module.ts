import { NgModule } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [],
  imports: [
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
    ProgressSpinnerModule,
    DialogModule,
  ],
  exports: [
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
    ProgressSpinnerModule,
    DialogModule,
  ],
})
export class PrimengModule { }
