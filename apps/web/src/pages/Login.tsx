import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore, useThemeStore } from '@zenner/core/store/index';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, Label } from '@zenner/ui';

// Inline SVG icons to avoid additional dependencies
function SunIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
    </svg>
  );
}

export function Login() {
  const { t, i18n } = useTranslation();
  const login = useAuthStore((state) => state.login);
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (username === 'thientn3' && password === '123456') {
      login('mock_token_123');
    } else {
      setErrorMsg(t('auth.invalidCredentials'));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-4 relative">
      {/* Top-right controls: Language + Theme toggle */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleLanguage}
          className="text-xs text-muted-foreground hover:text-foreground font-medium"
          aria-label="Toggle language"
        >
          {i18n.language === 'vi' ? 'EN' : 'VI'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          className="text-muted-foreground hover:text-foreground w-8 h-8 p-0"
          aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {resolvedTheme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </Button>
      </div>

      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="text-center pb-4 pt-8">
          <CardTitle className="font-outfit text-4xl font-extrabold text-primary mb-2">
            Zenner
          </CardTitle>
          <CardDescription className="text-muted-foreground text-sm font-medium">
            {t('common.slogan')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 px-6 pb-8">
          {errorMsg && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg font-medium border border-destructive/20">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="username">{t('auth.username')}</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                placeholder={t('auth.usernamePlaceholder')}
                autoComplete="username"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">{t('auth.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <Button type="submit" className="w-full mt-2 font-semibold" size="lg">
              {t('auth.login')}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
