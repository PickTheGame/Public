import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HomeComponent] }).compileComponents();
    fixture = TestBed.createComponent(HomeComponent);
    fixture.detectChanges();
  });

  it('places search before category filters in reading order', () => {
    const root = fixture.nativeElement as HTMLElement;
    const search = root.querySelector('query');
    const categories = root.querySelector('categories');
    if (!search || !categories) {
      throw new Error('Expected search and category controls to render.');
    }
    expect(search.compareDocumentPosition(categories) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('filters visible answers from search input', () => {
    const root = fixture.nativeElement as HTMLElement;
    const input = root.querySelector('input[type="search"]') as HTMLInputElement;
    input.value = 'Coach AI';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const countText = root.textContent ?? '';
    expect(countText).toContain('Showing 1 of 57 answers');
    expect(countText).toContain('What is Coach AI?');
  });
});
