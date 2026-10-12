import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesComponent } from './categories';

describe('CategoriesComponent', () => {
  let fixture: ComponentFixture<CategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CategoriesComponent] }).compileComponents();
    fixture = TestBed.createComponent(CategoriesComponent);
    fixture.componentRef.setInput('categories', [
      { title: 'General FAQ', slug: 'general' },
      { title: 'Pool Settings', slug: 'pool-settings' },
    ]);
    fixture.componentRef.setInput('selectedCategory', 'general');
    fixture.componentRef.setInput('totalCount', 9);
    fixture.componentRef.setInput('countBySlug', { general: 5, 'pool-settings': 4 });
    fixture.detectChanges();
  });

  it('renders category names and result counts', () => {
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(text).toContain('All (9)');
    expect(text).toContain('General FAQ (5)');
    expect(text).toContain('Pool Settings (4)');
  });

  it('emits the selected category when a category is clicked', () => {
    const selections: string[] = [];
    fixture.componentInstance.onCategorySelect.subscribe((slug) => selections.push(slug));
    const buttons = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'));
    buttons.find((button) => button.textContent?.includes('Pool Settings'))?.click();
    expect(selections).toEqual(['pool-settings']);
  });
});
