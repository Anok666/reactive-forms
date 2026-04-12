import { DOCUMENT } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { ThemePreferenceService } from './theme-preference.service';

describe('ThemePreferenceService', () => {
  let service: ThemePreferenceService;
  let documentRef: Document;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    service = TestBed.inject(ThemePreferenceService);
    documentRef = TestBed.inject(DOCUMENT);
    try {
      localStorage.removeItem('app-color-scheme');
    } catch {
      /* jsdom / restricted storage */
    }
    documentRef.documentElement.classList.remove('dark');
  });

  it('should set dark class when preference is dark', () => {
    service.setPreference('dark');
    expect(documentRef.documentElement.classList.contains('dark')).toBe(true);
  });

  it('should remove dark class when preference is light', () => {
    documentRef.documentElement.classList.add('dark');
    service.setPreference('light');
    expect(documentRef.documentElement.classList.contains('dark')).toBe(false);
  });
});
