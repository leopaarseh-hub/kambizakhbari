import { useTranslations } from 'next-intl';
import { ButtonLink } from '@/components/ui/Button';
import { StudSeam } from '@/components/ui/Stud';

export default function NotFound() {
  const t = useTranslations('NotFound');
  return (
    <div className="shell grid min-h-[60vh] place-items-center py-24 text-center">
      <div>
        <StudSeam className="mb-6 justify-center" />
        <p className="font-display text-7xl font-semibold tracking-tightest text-ink/15">
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-tightest text-ink">
          {t('title')}
        </h1>
        <p className="prose-body mx-auto mt-3 max-w-sm text-ink/65">{t('body')}</p>
        <div className="mt-8 flex justify-center">
          <ButtonLink href="/" withArrow>
            {t('home')}
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
