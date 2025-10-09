import { NgModule } from '@angular/core';

import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DialogModule } from 'primeng/dialog';
import { AvatarModule } from 'primeng/avatar';
import { Ripple } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { Menubar } from 'primeng/menubar';
import { PopoverModule } from 'primeng/popover';

@NgModule({
  declarations: [],
  imports: [
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
    ProgressSpinnerModule,
    DialogModule,
    AvatarModule,
    Ripple,
    BadgeModule,
    Menubar,
    PopoverModule,
  ],
  exports: [
    InputTextModule,
    FloatLabelModule,
    PasswordModule,
    ButtonModule,
    ProgressSpinnerModule,
    DialogModule,
    AvatarModule,
    Ripple,
    BadgeModule,
    Menubar,
    PopoverModule,
  ],
})
export class PrimengModule { }
