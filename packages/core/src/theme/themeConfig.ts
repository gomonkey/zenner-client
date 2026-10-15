import defaultThemes from './default-themes.json';

export interface ThemeConfig {
  id: string;
  name: string;
  plannerWrapper: string;
  headerDivider: string;
  toolbar: string;
  toolbarButton: string;
  toolbarButtonActive?: string;
  toolbarLogout: string;
  weekSelector: string;
  weekButtonActive: string;
  weekButtonInactive: string;
  reminderList: string;
  reminderToggleContainer: string;
  reminderToggleSeparator?: string;
  reminderToggleActiveY: string;
  reminderToggleActiveN: string;
  reminderToggleInactive: string;
  gratitudeCard: string;
  gratitudeStrip: string;
  matrixContainer: string;
  matrixUrgentHeader: string;
  matrixNotUrgentHeader: string;
  matrixImportantRow: string;
  matrixUnimportantRow: string;
  matrixCell: string;
  matrixTableHeader: string;
  matrixRowHover: string;
  matrixCheckboxActive: string;
  matrixCheckboxInactive: string;
  monthTabsContainer: string;
  monthButtonActive: string;
  monthButtonInactive: string;
  dailyGoalInput: string;
  timeblockContainer: string;
  timeblockHeader: string;
  timeblockModeLabel: string;
  timeblockTimeAxis: string;
  timeblockGridLine: string;
  timeblockEventCard: string;
  dropdownMenu: string;
  dropdownItemActive: string;
  dropdownItemInactive: string;
}

// Interface phục vụ riêng cho gói UI Timeblock độc lập
export interface TimeblockThemeConfig {
  id: string;
  timeblockContainer: string;
  timeblockHeader: string;
  timeblockModeLabel: string;
  timeblockTimeAxis: string;
  timeblockGridLine: string;
  timeblockEventCard: string;
}

// Cast array defaultThemes thành kiểu dữ liệu cụ thể
const defaultThemesCast = defaultThemes as ThemeConfig[];

// Hàm đọc danh sách theme gộp từ JSON mặc định, localStorage hoặc custom JSON đầu vào
export function getThemeList(customThemesJson?: string): ThemeConfig[] {
  const defaults = defaultThemesCast;

  // 1. Nạp JSON trực tiếp (Dành cho Mobile load từ AsyncStorage/DB hoặc Desktop đọc file)
  if (customThemesJson) {
    try {
      const customThemes = JSON.parse(customThemesJson) as ThemeConfig[];
      if (Array.isArray(customThemes)) {
        const filteredCustoms = customThemes.filter(
          ct => ct && ct.id && !defaults.some(d => d.id === ct.id)
        );
        return [...defaults, ...filteredCustoms];
      }
    } catch (e) {
      console.error("Lỗi parse customThemesJson trong getThemeList:", e);
    }
  }

  // 2. Fallback sang localStorage nếu chạy trên Web Browser
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const rawThemes = localStorage.getItem('zenner-boost-themes');
      if (rawThemes) {
        const customThemes = JSON.parse(rawThemes) as ThemeConfig[];
        if (Array.isArray(customThemes)) {
          const filteredCustoms = customThemes.filter(
            ct => ct && ct.id && !defaults.some(d => d.id === ct.id)
          );
          return [...defaults, ...filteredCustoms];
        }
      }
    } catch (err) {
      console.error("Lỗi khi đọc zenner-boost-themes từ localStorage:", err);
    }
  }

  return defaults;
}

// Fallback theme mặc định
export const defaultTheme = defaultThemesCast[0];
