import { NgClass } from '@angular/common';
import { Component, effect, input, model, signal } from '@angular/core';
import { MarkdownComponent, provideMarkdown } from 'ngx-markdown';

@Component({
  selector: 'faq-item',
  imports: [NgClass, MarkdownComponent],
  templateUrl: './faq-item.html',
  styles: ' :host { display: block;} ',
  providers: [
    provideMarkdown()
  ],
})
export class FaqItemComponent {

  faq = input.required<{question: string, pageTitle: string, tags: string[], answerMd: string }>();
  isOpened = signal<boolean>(false);

  public closeAll(){
    this.isOpened.set(false);
  }

}
