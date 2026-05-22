type AppLogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  alt?: string;
};

const heights = { sm: 48, md: 80, lg: 120 };

export function AppLogo({ className = '', size = 'md', alt = 'MiniAcademy' }: AppLogoProps) {
  return (
    <img
      src="/logo.png"
      alt={alt}
      className={`app-logo app-logo-${size} ${className}`.trim()}
      height={heights[size]}
      width="auto"
      decoding="async"
    />
  );
}
