import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagsComponent } from './tags';

describe('TagsComponent', () => {
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [TagsComponent] }).compileComponents();
    fixture = TestBed.createComponent(TagsComponent);
    fixture.componentRef.setInput('tags', ['picks', 'standings']);
    fixture.componentRef.setInput('selectedTag', 'picks');
    fixture.detectChanges();
  });

  it('shows a clear action when a tag is active', () => {
    const clearButton = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'))
      .find((button) => button.textContent?.trim() === 'Clear');
    expect(clearButton).toBeTruthy();
  });

  it('emits all when the active tag is cleared', () => {
    const changes: string[] = [];
    fixture.componentInstance.onTagChange.subscribe((tag) => changes.push(tag));
    const clearButton = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'))
      .find((button) => button.textContent?.trim() === 'Clear');
    clearButton?.click();
    expect(changes).toEqual(['all']);
  });
});
