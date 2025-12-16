import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
    // Список всех поддерживаемых локалей
    locales: ['en', 'ru', 'pl', 'ua'],

    // Локаль по умолчанию, используется когда язык не соответствует
    defaultLocale: 'en',

    // Включить автоматическое определение языка браузера
    localeDetection: true,

    // Префикс локали в URL (always - всегда показывать, as-needed - скрывать для defaultLocale)
    localePrefix: 'always',
});
