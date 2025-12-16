'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState } from 'react';

interface LanguageOption {
    code: string;
    name: string;
    flag: string;
}

const languageOptions: LanguageOption[] = [
    { code: 'en', name: 'English', flag: 'En' },
    { code: 'ru', name: 'Русский', flag: 'Ru' },
    { code: 'pl', name: 'Polski', flag: 'Pl' },
    { code: 'ua', name: 'Українська', flag: 'Ua' },
];

export function LanguageSwitcher({
    className,
    textColor = 'white',
}: {
    className?: string;
    textColor?: 'white' | 'black';
}) {
    const textColorClass = textColor === 'black' ? 'text-black' : 'text-white';
    const t = useTranslations('LanguageSwitcher');
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const currentLanguage = languageOptions.find((lang) => lang.code === locale);

    const handleLanguageChange = (langCode: string) => {
        // Сохраняем выбор пользователя в cookie (используется next-intl middleware)
        document.cookie = `NEXT_LOCALE=${langCode}; path=/; max-age=31536000; SameSite=Lax`;

        // Используем типизированный роутер из next-intl
        router.push(pathname, { locale: langCode });
        setIsOpen(false);
    };

    return (
        <div className={`relative ${className}`}>
            {/* Кнопка переключения */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 text-xl font-medium ${textColorClass}`}
                aria-label={t('language')}
            >
                <Image src={`/header/global-${textColor}.svg`} alt="language" width={24} height={24} />
                <span className={`hidden sm:inline ${textColorClass}`}>{currentLanguage?.flag}</span>
                <Image
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    src={`/arrow-down-${textColor}.svg`}
                    alt="arrow-down"
                    width={24}
                    height={24}
                />
            </button>

            {/* Выпадающее меню */}
            {isOpen && (
                <div className="border-brown absolute top-full right-0 z-50 mt-1 w-48 overflow-hidden border bg-white shadow-lg">
                    {languageOptions.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => handleLanguageChange(lang.code)}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors duration-200 hover:bg-gray-50 ${
                                locale === lang.code ? 'text-brown pointer-events-none bg-blue-50' : 'text-gray-700'
                            }`}
                        >
                            <span>{lang.name}</span>
                            {locale === lang.code && (
                                <svg className="text-brown ml-auto h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path
                                        fillRule="evenodd"
                                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}

            {/* Фон для закрытия меню */}
            {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
        </div>
    );
}
