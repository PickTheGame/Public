import { Component, computed, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('HelpDesk');
  protected readonly showHeader = computed(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    return new URLSearchParams(window.location.search).get('fromApp') !== 'true';
  });
}
