import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export type ColorSchemePreference = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'app-color-scheme';

@Injectable({ providedIn: 'root' })
export class ThemePreferenceService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private mediaQuery?: MediaQueryList;
  private mediaListener?: () => void;

  schemeOptions: { label: string; value: ColorSchemePreference }[] = [
    { label: 'System', value: 'system' },
    { label: 'Jasny', value: 'light' },
    { label: 'Ciemny', value: 'dark' },
  ];

  readonly preference = signal<ColorSchemePreference>('system');

  private readonly systemDark = signal(false);

  readonly effectiveDark = computed(() => {
    const pref = this.preference();
    if (pref === 'dark') {
      return true;
    }
    if (pref === 'light') {
      return false;
    }
    return this.systemDark();
  });

  init(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const stored = this.readStoredPreference();
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      this.preference.set(stored);
    }
    this.systemDark.set(window.matchMedia('(prefers-color-scheme: dark)').matches);
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.mediaListener = () => {
      this.systemDark.set(this.mediaQuery!.matches);
      if (this.preference() === 'system') {
        this.applyDom();
      }
    };
    this.mediaQuery.addEventListener('change', this.mediaListener);
    this.applyDom();
  }

  setPreference(value: ColorSchemePreference): void {
    this.preference.set(value);
    if (isPlatformBrowser(this.platformId)) {
      this.writeStoredPreference(value);
    }
    this.applyDom();
  }

  private readStoredPreference(): ColorSchemePreference | null {
    try {
      return localStorage.getItem(STORAGE_KEY) as ColorSchemePreference | null;
    } catch {
      return null;
    }
  }

  private writeStoredPreference(value: ColorSchemePreference): void {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* storage unavailable (private mode, tests, etc.) */
    }
  }

  private applyDom(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    this.document.documentElement.classList.toggle('dark', this.effectiveDark());
  }
}
