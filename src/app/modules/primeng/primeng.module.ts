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
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';

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
    SplitButtonModule,
    TableModule,
    IconField,
    InputIcon,
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
    SplitButtonModule,
    TableModule,
    IconField,
    InputIcon,
  ],
})
export class PrimengModule { }
