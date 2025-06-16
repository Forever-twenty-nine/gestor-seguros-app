// src/shared/animations.ts
import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

export const fadeIn = trigger('fadeIn', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
    ])
]);

export const scaleIn = trigger('scaleIn', [
    transition(':enter', [
        style({ transform: 'scale(0.95)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'scale(1)', opacity: 1 }))
    ])
]);

export const fadeSlideRight = trigger('fadeSlideRight', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
    ])
]);

export const staggerFadeSlideIn = trigger('staggerFadeSlideIn', [
    transition(':enter', [
        query('li', [
            style({ opacity: 0, transform: 'translateY(10px)' }),
            stagger(100, [
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ])
        ])
    ])
]);
