import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaqItemComponent } from './faq-item';

describe('FaqItemComponent', () => {
  let fixture: ComponentFixture<FaqItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [FaqItemComponent] }).compileComponents();
    fixture = TestBed.createComponent(FaqItemComponent);
    fixture.componentRef.setInput('faq', {
      id: 'change-picks',
      question: 'Can I change my picks?',
      pageTitle: 'Pick and Deadlines',
      tags: ['picks'],
      answerMd: 'Yes, until the deadline.',
    });
    fixture.detectChanges();
  });

  it('keeps the answer out of the DOM while collapsed', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('[role="region"]')).toBeNull();
    expect(root.querySelector('button')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('reveals an associated answer region when expanded', async () => {
    const root = fixture.nativeElement as HTMLElement;
    const button = root.querySelector('button') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const region = root.querySelector('[role="region"]');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(button.getAttribute('aria-controls')).toBe('faq-panel-change-picks');
    expect(region?.getAttribute('aria-labelledby')).toBe('faq-button-change-picks');
    expect(region?.textContent).toContain('Yes, until the deadline.');
  });
});
