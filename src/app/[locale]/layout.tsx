import { SITE_URL } from '@/app/robots';
import { routing } from '@/i18n/routing';
import { AppProvider } from '@/providers';
import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { Lato, Viaoda_Libre } from 'next/font/google';
import { notFound } from 'next/navigation';
import Script from 'next/script';
import '../globals.css';

const viaodaLibre = Viaoda_Libre({
    variable: '--font-viaoda-libre',
    subsets: ['latin'],
    weight: '400',
});

const lato = Lato({
    variable: '--font-lato',
    subsets: ['latin'],
    weight: ['400', '300'],
});

// Генерируем статические параметры для всех локалей
export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

// Генерируем метаданные с учетом локали
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Metadata' });

    const title = t('title');
    const description = t('description');
    const canonicalUrl = `${SITE_URL}/${locale}`;

    // Генерируем альтернативные языковые ссылки
    const languages: Record<string, string> = {};
    for (const loc of routing.locales) {
        languages[loc] = `${SITE_URL}/${loc}`;
    }
    languages['x-default'] = `${SITE_URL}/${routing.defaultLocale}`;

    return {
        title,
        description,
        keywords: t('keywords'),
        authors: [{ name: 'Renovo Atelier' }],
        creator: 'Renovo Atelier',
        publisher: 'Renovo Atelier',
        metadataBase: new URL(SITE_URL),
        alternates: {
            canonical: canonicalUrl,
            languages,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'Renovo Atelier',
            locale: locale,
            type: 'website',
            images: [
                {
                    url: `${SITE_URL}/og-image.jpg`,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [`${SITE_URL}/og-image.jpg`],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            // Раскомментируйте и добавьте свои коды верификации
            // google: 'ваш-код-google-search-console',
            // yandex: 'ваш-код-яндекс-вебмастер',
        },
    };
}

interface LocaleLayoutProps {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}

// JSON-LD структурированные данные для LocalBusiness (швейное ателье)
function getJsonLd(locale: string) {
    return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        '@id': `${SITE_URL}/#business`,
        name: 'Renovo Atelier',
        description:
            locale === 'pl'
                ? 'Profesjonalny zakład krawiecki w Polsce. Naprawa odzieży, szycie na miarę, przeróbki i haft.'
                : locale === 'ru'
                  ? 'Профессиональное швейное ателье в Польше. Ремонт одежды, индивидуальный пошив, перешив и вышивка.'
                  : locale === 'ua'
                    ? 'Професійне швейне ательє в Польщі. Ремонт одягу, індивідуальне пошиття, перешиття та вишивка.'
                    : 'Professional tailoring atelier in Poland. Clothing repair, custom tailoring, alterations and embroidery.',
        url: `${SITE_URL}/${locale}`,
        telephone: '+48 796 271 708',
        email: 'renovoateliermail@gmail.com',
        image: `${SITE_URL}/og-image.jpg`,
        priceRange: '$$',
        currenciesAccepted: 'PLN',
        paymentAccepted: 'Cash, Card',
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'PL',
        },
        geo: {
            '@type': 'GeoCoordinates',
            // Укажите координаты вашего ателье
        },
        openingHoursSpecification: [
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                opens: '09:00',
                closes: '18:00',
            },
            {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: 'Saturday',
                opens: '10:00',
                closes: '14:00',
            },
        ],
        sameAs: [
            // Добавьте ссылки на социальные сети
        ],
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5',
            reviewCount: '4',
            bestRating: '5',
            worstRating: '1',
        },
        hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: 'Tailoring Services',
            itemListElement: [
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Clothing Repair',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Custom Tailoring',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Alteration & Restoration',
                    },
                },
                {
                    '@type': 'Offer',
                    itemOffered: {
                        '@type': 'Service',
                        name: 'Embroidery & Decor',
                    },
                },
            ],
        },
    };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
    // Проверяем, что входящая локаль валидна
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) {
        notFound();
    }

    // Получаем переводы для клиентских компонентов
    const messages = await getMessages();

    // JSON-LD данные для структурированной разметки
    const jsonLd = getJsonLd(locale);

    return (
        <html lang={locale} data-scroll-behavior="smooth">
            <head>
                {/* JSON-LD структурированные данные для поисковиков */}
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
            </head>
            <body className={`${viaodaLibre.variable} ${lato.variable} antialiased`}>
                {/* EmailJS инициализация */}
                <Script
                    src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"
                    strategy="beforeInteractive"
                />

                <NextIntlClientProvider messages={messages}>
                    <AppProvider>{children}</AppProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
