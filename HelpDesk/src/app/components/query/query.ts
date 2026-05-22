import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'query',
  templateUrl: './query.html',
  styles: ' :host { display: block;} '
})
export class QueryComponent {
  query = input<string>();
  onQueryChange = output<string>();
}
