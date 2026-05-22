type AppLogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  alt?: string;
};

const heights = { sm: 56, md: 100, lg: 160, xl: 200 };

export function AppLogo({ className = '', size = 'md', alt = 'MiniAcademy' }: AppLogoProps) {
  const src = size === 'sm' ? '/logo-square.png' : '/logo.png';
  return (
    <img
      src={src}
      alt={alt}
      className={`app-logo app-logo-${size} ${className}`.trim()}
      height={heights[size]}
      width="auto"
      decoding="async"
    />
  );
}
