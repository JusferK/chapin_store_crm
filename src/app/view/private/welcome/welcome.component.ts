import { Component, computed, inject, Signal, signal } from '@angular/core';
import { UserManagerService } from '../../../services/execute/user-manager.service';
import { AdministratorData } from '../../../interface/model.interface';

@Component({
  selector: 'app-welcome',
  standalone: false,
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {

  private _userManagerService: UserManagerService = inject(UserManagerService);

  welcomingGreet: Signal<string> = computed((): string => {
    const adminData: AdministratorData = this._userManagerService.getAdminData!;
    return `¡Bienvenido ${adminData.username}!`
  });

}
