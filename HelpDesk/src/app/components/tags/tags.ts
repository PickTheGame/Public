import { NgClass } from '@angular/common';
import { Component, input, model, output } from '@angular/core';

@Component({
  selector: 'tags',
  imports: [NgClass],
  templateUrl: './tags.html',
  styles: ' :host { display: block;} '
})
export class TagsComponent {
  tags = input.required<string[]>();
  selectedTag = input.required<string>();

  onTagChange = output<string>();
}
