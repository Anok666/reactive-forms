import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { SelectButton } from 'primeng/selectbutton';

import { ThemePreferenceService } from './core/theme/theme-preference.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, SelectButton],
  templateUrl: './app.html',
})
export class App {
  readonly theme = inject(ThemePreferenceService);
}
