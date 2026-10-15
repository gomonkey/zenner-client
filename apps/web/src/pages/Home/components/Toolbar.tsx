import { useState } from 'react';
import { Button } from '@zenner/ui';
import { ThemeConfig, getThemeList } from '@zenner/core/theme/themeConfig';

// SVG Icons cho Toolbar
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}

function LogOutIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

interface ToolbarProps {
  currentLanguage: string;
  resolvedTheme: string;
  toggleLanguage: () => void;
  toggleTheme: () => void;
  logout: () => void;
  logoutLabel: string;
  themeBoost: string;
  toggleThemeBoost: (theme: string) => void;
  themeConfig: ThemeConfig;
}

export function Toolbar({
  currentLanguage,
  resolvedTheme,
  toggleLanguage,
  toggleTheme,
  logout,
  logoutLabel,
  themeBoost,
  toggleThemeBoost,
  themeConfig
}: ToolbarProps) {
  const [isOpenSettings, setIsOpenSettings] = useState(false);

  // Lấy danh sách theme động từ localStorage
  const availableThemes = getThemeList();

  return (
    <div className={themeConfig.toolbar}>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className={themeConfig.toolbarButton}
      >
        {currentLanguage === 'vi' ? 'EN' : 'VI'}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className={themeConfig.toolbarButton}
      >
        {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </Button>
      
      {/* Nút Setting có Dropdown */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpenSettings(!isOpenSettings)}
          className={`${themeConfig.toolbarButton} ${isOpenSettings && themeConfig.toolbarButtonActive ? themeConfig.toolbarButtonActive : ''}`}
          aria-label="Settings"
        >
          <SettingsIcon />
        </Button>

        {isOpenSettings && (
          <>
            {/* Overlay vô hình để click ra ngoài đóng menu */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpenSettings(false)} />
            
            {/* Dropdown Menu Box */}
            <div className={themeConfig.dropdownMenu}>
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 dark:text-zinc-550 px-2 py-1 block select-none">
                Boost Theme
              </span>
              
              {/* Render danh sách theme động */}
              {availableThemes.map((themeItem) => {
                const isActive = themeBoost === themeItem.id;
                
                return (
                  <button
                    key={themeItem.id}
                    onClick={() => {
                      toggleThemeBoost(themeItem.id);
                      setIsOpenSettings(false);
                    }}
                    className={isActive ? themeConfig.dropdownItemActive : themeConfig.dropdownItemInactive}
                  >
                    <span>{themeItem.name}</span>
                    {isActive && <CheckIcon />}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      <div className="w-[1.5px] h-4 bg-zinc-300 dark:bg-zinc-700 self-center mx-0.5" />
      
      <Button
        variant="ghost"
        size="sm"
        onClick={logout}
        className={themeConfig.toolbarLogout}
        aria-label={logoutLabel}
      >
        <LogOutIcon />
      </Button>
    </div>
  );
}
