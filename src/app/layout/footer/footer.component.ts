import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule, Instagram, MessageCircle, Music2 } from 'lucide-angular';

interface FooterLink { label: string; link: string; query?: Record<string, string>; }

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, LucideAngularModule],
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
      title: 'Discover',
      links: [
        { label: 'Salons', link: '/' },
        { label: 'Barbershops', link: '/', query: { category: 'BARBER' } },
        { label: 'Tattoo studios', link: '/', query: { category: 'TATTOO' } },
        { label: 'Nail studios', link: '/', query: { category: 'NAIL' } },
      ],
    },
    {
      title: 'The platform',
      links: [
        { label: 'About us', link: '/about' },
        { label: 'List your salon', link: '/auth/sign-in' },
        { label: 'Contact', link: '/contact' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Help center', link: '/help' },
        { label: 'Privacy policy', link: '/privacy' },
        { label: 'Terms & conditions', link: '/terms' },
      ],
    },
  ];
}
