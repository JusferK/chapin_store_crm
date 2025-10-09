import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';
import { PrefixInterceptor } from './interceptors/prefix.interceptor';
import { MainFrameComponent } from './view/private/main-frame/main-frame.component';
import { LoginComponent } from './view/public/login/login.component';
import { LoggedGuard } from './guards/logged.guard';
import { NotLoggedGuard } from './guards/not-logged.guard';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { PrimengModule } from './modules/primeng/primeng.module';
import Lara from '@primeng/themes/lara';
import { definePreset } from '@primeuix/themes';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { ReactiveFormsModule } from '@angular/forms';
import { TokenHeaderInterceptor } from './interceptors/token-header.interceptor';
import { MenuListResolver } from './resolver/menu-list.resolver';
import { ProfileComponent } from './view/private/profile/profile.component';
import { WelcomeComponent } from './view/private/welcome/welcome.component';

const MiTema = definePreset(Lara, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    }
  }
});

@NgModule({
  declarations: [
    AppComponent,
    MainFrameComponent,
    LoginComponent,
    ProfileComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    PrimengModule,
    ReactiveFormsModule,
  ],
  providers: [
    LoggedGuard,
    NotLoggedGuard,
    provideAnimationsAsync(),
    provideAnimations(),
    provideHttpClient(
      withInterceptorsFromDi()
    ),
    providePrimeNG({
      theme: {
        preset: MiTema,
        options: {
          darkModeSelector: false,
        }
      }
    }),
    { provide: HTTP_INTERCEPTORS, useClass: PrefixInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: TokenHeaderInterceptor, multi: true },
    MenuListResolver,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
