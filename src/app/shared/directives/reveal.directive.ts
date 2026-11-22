import { Directive, ElementRef, OnDestroy, OnInit, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({ selector: '[appReveal]', standalone: true })
export class RevealDirective implements OnInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>).nativeElement;
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private io?: IntersectionObserver;

  ngOnInit(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') return;

    this.io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) {
        this.host.classList.add('reveal-hold');
        return;
      }
      this.host.classList.remove('reveal-hold');
      this.host.classList.add('reveal-in');
      this.io?.disconnect();
    }, { rootMargin: '0px 0px -8% 0px' });

    this.io.observe(this.host);
  }

  ngOnDestroy(): void {
    this.io?.disconnect();
  }
}
