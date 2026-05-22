import { Link } from 'react-router-dom';

type Props = {
  to: string;
  title: string;
  subtitle?: string;
  icon?: string;
  subject?: string;
  actionLabel?: string;
};

export function AdminColorCard({ to, title, subtitle, icon, subject = 'purple', actionLabel }: Props) {
  return (
    <Link to={to} className={`admin-color-card ${subject}`}>
      {icon && <span className="admin-color-card-icon">{icon}</span>}
      <div className="admin-color-card-text">
        <strong>{title}</strong>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {actionLabel && <span className="admin-color-card-action">{actionLabel}</span>}
    </Link>
  );
}
