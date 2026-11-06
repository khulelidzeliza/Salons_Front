import { TranslatePipe } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Instagram, MessageCircle, Music2 } from 'lucide-angular';

interface FooterLink { label: string; link: string; query?: Record<string, string>; }

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [TranslatePipe, RouterLink, LucideAngularModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent {
  readonly InstagramIcon = Instagram;
  readonly WhatsappIcon = MessageCircle;
  readonly TikTokIcon = Music2;

  readonly currentYear = new Date().getFullYear();

  readonly columns: { title: string; links: FooterLink[] }[] = [
    {
      title: 'footer.discover.title',
      links: [
        { label: 'footer.discover.salons', link: '/' },
        { label: 'footer.discover.barbershops', link: '/', query: { category: 'BARBER' } },
        { label: 'footer.discover.tattoo', link: '/', query: { category: 'TATTOO' } },
        { label: 'footer.discover.nails', link: '/', query: { category: 'NAIL' } },
      ],
    },
    {
      title: 'footer.platform.title',
      links: [
        { label: 'footer.platform.about', link: '/about' },
        { label: 'footer.platform.listSalon', link: '/auth/sign-in' },
        { label: 'footer.platform.contact', link: '/contact' },
      ],
    },
    {
      title: 'footer.support.title',
      links: [
        { label: 'footer.support.help', link: '/help' },
        { label: 'footer.support.privacy', link: '/privacy' },
        { label: 'footer.support.terms', link: '/terms' },
      ],
    },
  ];
}
