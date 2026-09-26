import { ThemeConfig } from '@zenner/core/theme/themeConfig';

interface GratitudeCardProps {
  quote: string;
  themeConfig: ThemeConfig;
}

export function GratitudeCard({ quote, themeConfig }: GratitudeCardProps) {
  return (
    <div className={themeConfig.gratitudeCard}>
      <div className={themeConfig.gratitudeStrip} />
      <p className="text-xs font-medium text-zinc-700 dark:text-zinc-300 italic leading-relaxed px-2">
        "{quote}"
      </p>
    </div>
  );
}
