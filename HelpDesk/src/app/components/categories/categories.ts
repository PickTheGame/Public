import { NgClass } from '@angular/common';
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'categories',
  imports: [NgClass],
  templateUrl: './categories.html',
  styles: ' :host { display: block;} '
})
export class CategoriesComponent {
  categories = input.required<{ title: string, slug: string }[]>();
  selectedCategory = input.required<string>();

  totalCount = input.required<number>();
  countBySlug = input.required<Record<string, number>>({});

  onCategorySelect = output<string>();
}
