import { Component, computed, inject, OnInit, Signal } from '@angular/core';
import { SpinnerService } from './services/execute/spinner.service';
import { SessionManagerService } from './services/execute/session-manager.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  private readonly _spinnerService: SpinnerService = inject(SpinnerService);
  private readonly _sessionMangerService: SessionManagerService = inject(SessionManagerService);
  showSpinner: Signal<boolean> = computed((): boolean => this._spinnerService.getShowSpinner);

  ngOnInit(): void {
    this.handleSession();
  }

  private handleSession(): void {
    this._sessionMangerService.evaluateSession();
  }

}
