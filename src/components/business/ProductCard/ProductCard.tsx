'use client';
import ArrowRightIcon from '@/assets/icons/arrow-right.svg';
import { Button } from '@/components/ui';
import { useMounted } from '@/hooks';
import { useRouter } from '@/i18n/navigation';
import { useBasketStore } from '@/providers';
import cn from 'classnames';
import { useTranslations } from 'next-intl';
import Image, { StaticImageData } from 'next/image';
import { FC, useMemo } from 'react';
import { toast } from 'react-toastify';

interface ProductCardProps {
    className?: string;
    image: StaticImageData;
    title: string;
    price: string;
}
export const ProductCard: FC<ProductCardProps> = (props) => {
    const { className, image, title, price } = props;
    const t = useTranslations('OurServices');
    const mounted = useMounted();
    const router = useRouter();

    const addItem = useBasketStore((state) => state.addItem);
    const removeItem = useBasketStore((state) => state.removeItem);
    // Подписываемся напрямую на items для реактивности
    const items = useBasketStore((state) => state.items);

    // Используем состояние корзины только после монтирования для предотвращения ошибок гидратации
    const isInBasket = useMemo(
        () => (mounted ? items.some((item) => item.id === title) : false),
        [items, mounted, title],
    );

    const handleToggleBasket = () => {
        if (isInBasket) {
            removeItem(title);
        } else {
            addItem({
                id: title,
                title: title,
                price: price,
                image: image.src,
            });
            toast.success(
                <div className="flex flex-col gap-2">
                    <span>{t('addedToBasket')}</span>
                    <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                            router.push('/basket');
                            toast.dismiss();
                        }}
                        className="w-full"
                    >
                        {t('goToBasket')}
                    </Button>
                </div>,
            );
        }
    };

    return (
        <div className={cn(className, 'flex h-full flex-col gap-2 border border-black p-3 lg:gap-3')}>
            <Image
                src={image}
                alt={title}
                width={336}
                height={512}
                className="h-50 w-full object-contain sm:h-100 md:h-[512px]"
            />
            <p className="">{t(title)}</p>
            <Button size="sm" onClick={handleToggleBasket} variant={isInBasket ? 'secondary' : 'primary'}>
                <span className="flex w-full items-center justify-between">
                    {isInBasket ? t('addedToBasket') : t('fromPrice', { price })}
                    <ArrowRightIcon className="h-6 w-6" />
                </span>
            </Button>
        </div>
    );
};
