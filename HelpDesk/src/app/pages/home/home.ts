import { Component, computed, inject, QueryList, signal, ViewChildren } from '@angular/core';
import { FaqDataService, FaqIndex } from '../../service/faq-data.service';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { toSignal } from '@angular/core/rxjs-interop';
import { TagsComponent } from '../../components/tags/tags';
import { CategoriesComponent } from '../../components/categories/categories';
import { QueryComponent } from '../../components/query/query';
import { FaqItemComponent } from '../../components/faq-item/faq-item';

@Component({
  selector: 'app-home',
  imports: [MarkdownModule, TagsComponent, CategoriesComponent, QueryComponent, FaqItemComponent],
  templateUrl: './home.html'
})
export class HomeComponent {
  private faqData = inject(FaqDataService);

  // UI state
  query = signal('');
  selectedCategory = signal<'all' | string>('all');
  selectedTag = signal<'all' | string>('all');
  isAllOpened = signal<boolean>(false);

  // Data (loaded once)
  private data = signal<FaqIndex>(this.faqData.load());

  // View model (reacts to signals instantly)
  vm = computed(() => {
    const data = this.data();
    if (!data) return null;

    const allTags = new Set<string>();
    const countBySlug: Record<string, number> = {};

    for (const f of data.faqs) {
      for (const t of f.tags) allTags.add(t);
      countBySlug[f.slug] = (countBySlug[f.slug] ?? 0) + 1;
    }

    const categories = data.categories;
    const tags = Array.from(allTags).sort((a, b) => a.localeCompare(b));

    const q = this.query().trim().toLowerCase();
    const cat = this.selectedCategory();
    const tag = this.selectedTag();

    const filtered = data.faqs.filter((f) => {
      const matchesCategory = cat === 'all' ? true : f.slug === cat;
      const matchesTag = tag === 'all' ? true : f.tags.includes(tag);
      const matchesQuery =
        !q ||
        f.question.toLowerCase().includes(q) ||
        f.answerMd.toLowerCase().includes(q) ||
        f.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesTag && matchesQuery;
    });

    return {
      data,
      categories,
      tags,
      totalCount: data.faqs.length,
      countBySlug,
      filtered,
    };
  });

  // Actions
  selectCategory(slug: 'all' | string) {
    this.selectedCategory.set(slug);
    this.collapseAll();
  }

  @ViewChildren(FaqItemComponent)
  private faqItems!: QueryList<FaqItemComponent>;
  
  collapseAll() {
    this.faqItems.forEach(f => f.closeAll());
  }
}
