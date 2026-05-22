import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AvatarCharacter } from '../components/AvatarCharacter';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../api';
import type { ShopItem } from '../types';

const CATEGORIES = ['hair', 'skin', 'top', 'bottom', 'shoes', 'accessory'] as const;

export default function ShopPage() {
  const { user, setUser } = useAuth();
  const { t } = useLanguage();
  const [items, setItems] = useState<ShopItem[]>([]);
  const [category, setCategory] = useState<string>('hair');
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getShopItems().then((r) => setItems(r.items));
  }, []);

  if (!user) return null;

  const filtered = items.filter((i) => i.category === category);

  const handleBuy = async (itemId: string) => {
    setMessage('');
    try {
      const { user: u } = await api.buyItem(itemId);
      setUser(u);
      setMessage('Purchased! Item equipped.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Purchase failed');
    }
  };

  return (
    <div className="page shop-page">
      <Link to="/profile" className="back-btn">← {t('profile')}</Link>
      <h1>🛍️ {t('avatarShop')}</h1>
      <p className="shop-points">Your points: ⭐ {user.points}</p>

      <div className="shop-layout">
        <div className="shop-preview card purple-border">
          <AvatarCharacter gender={user.characterGender} avatar={user.avatar} size={140} />
        </div>
        <div className="shop-items card yellow-border">
          <div className="category-tabs">
            {CATEGORIES.map((c) => (
              <button key={c} type="button" className={category === c ? 'active' : ''} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>
          <div className="items-grid">
            {filtered.map((item) => {
              const owned = user.ownedItems.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`shop-item ${owned ? 'owned' : ''}`}
                  onClick={() => !owned && handleBuy(item.id)}
                  disabled={owned || user.points < item.cost}
                >
                  <span>{item.label}</span>
                  <span className="cost">{item.cost === 0 ? 'Free' : `⭐ ${item.cost}`}</span>
                  {owned && <span className="owned-tag">Owned</span>}
                </button>
              );
            })}
          </div>
          {message && <p className="shop-msg">{message}</p>}
        </div>
      </div>
    </div>
  );
}
