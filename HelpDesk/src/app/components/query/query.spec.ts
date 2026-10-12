import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QueryComponent } from './query';

describe('QueryComponent', () => {
  let fixture: ComponentFixture<QueryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [QueryComponent] }).compileComponents();
    fixture = TestBed.createComponent(QueryComponent);
    fixture.componentRef.setInput('query', 'deadline');
    fixture.detectChanges();
  });

  it('associates the visible label with the search field', () => {
    const root = fixture.nativeElement as HTMLElement;
    expect(root.querySelector('label')?.getAttribute('for')).toBe('faq-search');
    expect(root.querySelector('input')?.id).toBe('faq-search');
  });

  it('emits the current search text when the user types', () => {
    const changes: string[] = [];
    fixture.componentInstance.onQueryChange.subscribe((query) => changes.push(query));
    const input = (fixture.nativeElement as HTMLElement).querySelector('input') as HTMLInputElement;
    input.value = 'survivor';
    input.dispatchEvent(new Event('input'));
    expect(changes).toEqual(['survivor']);
  });
});
