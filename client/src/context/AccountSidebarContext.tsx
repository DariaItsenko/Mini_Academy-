import { createContext, useContext, useState, type ReactNode } from 'react';

interface AccountSidebarContextValue {
  open: boolean;
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

const AccountSidebarContext = createContext<AccountSidebarContextValue | null>(null);

export function AccountSidebarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <AccountSidebarContext.Provider
      value={{
        open,
        openSidebar: () => setOpen(true),
        closeSidebar: () => setOpen(false),
        toggleSidebar: () => setOpen((v) => !v),
      }}
    >
      {children}
    </AccountSidebarContext.Provider>
  );
}

export function useAccountSidebar() {
  const ctx = useContext(AccountSidebarContext);
  if (!ctx) throw new Error('useAccountSidebar must be used within AccountSidebarProvider');
  return ctx;
}
