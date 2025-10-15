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
import { FloatLabel } from "primeng/floatlabel"
import { Select } from 'primeng/select';
import { ScrollerModule } from 'primeng/scroller';
import { FieldsetModule } from 'primeng/fieldset';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { MessageModule } from 'primeng/message';
import { Textarea } from 'primeng/textarea';
import { MessageService } from 'primeng/api';

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
    FloatLabel,
    Select,
    ScrollerModule,
    FieldsetModule,
    DividerModule,
    ToastModule,
    MessageModule,
    Textarea,
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
    FloatLabel,
    Select,
    ScrollerModule,
    FieldsetModule,
    DividerModule,
    ToastModule,
    MessageModule,
    Textarea,
  ],
  providers: [
    MessageService,
  ]
})
export class PrimengModule { }
