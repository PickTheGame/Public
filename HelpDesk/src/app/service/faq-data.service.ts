import { Injectable } from '@angular/core';
import faq from '../../assets/faq/generated/faq.json';

export type FaqIndex = {
  generatedAt: string;
  schemaVersion: number;
  categories: Array<{
    slug: string;
    title: string;
    category: string;
    tags: string[];
    sourceFile: string;
  }>;
  faqs: Array<{
    id: string;
    slug: string;
    category: string;
    pageTitle: string;
    question: string;
    tags: string[];
    answerMd: string;
  }>;
};

@Injectable({ providedIn: 'root' })
export class FaqDataService {
  load() {
    return faq as FaqIndex;
  }
}