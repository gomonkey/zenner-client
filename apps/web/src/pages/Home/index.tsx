import { useAuthStore, useThemeStore } from '@zenner/core/store/index';
import { Button, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@zenner/ui';

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

export function Home() {
  const logout = useAuthStore((state) => state.logout);
  const { resolvedTheme, toggleTheme } = useThemeStore();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background relative">
      {/* Top-right theme toggle */}
      <div className="absolute top-4 right-4">
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

      <Card className="p-4 max-w-md text-center shadow-xl border-border">
        <CardHeader>
          <CardTitle className="font-outfit text-3xl font-bold text-primary mb-1">
            Home Page
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium">
            Bạn đã đăng nhập thành công vào hệ thống Zenner.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <Button 
            variant="destructive"
            onClick={logout}
            className="w-full font-semibold"
          >
            Đăng xuất
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
