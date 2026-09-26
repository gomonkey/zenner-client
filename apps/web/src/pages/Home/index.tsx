import { useTranslation } from 'react-i18next';
import { useAuthStore, useThemeStore } from '@zenner/core/store/index';
import { Timeblock } from '@zenner/ui';
import { useHomeData } from './hooks/useHomeData';
import { Toolbar } from './components/Toolbar';
import { WeekSelector } from './components/WeekSelector';
import { ReminderList } from './components/ReminderList';
import { GratitudeCard } from './components/GratitudeCard';
import { EisenhowerMatrix } from './components/EisenhowerMatrix';
import { MonthTabs } from './components/MonthTabs';
import { getThemeList, defaultTheme } from '@zenner/core/theme/themeConfig';

export function Home() {
  const logout = useAuthStore((state) => state.logout);
  const { resolvedTheme, toggleTheme } = useThemeStore();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'vi' ? 'en' : 'vi');
  };

  const {
    pageData,
    themeBoost,
    toggleThemeBoost,
    handleToggleReminder,
    handleToggleDoTask,
    handleTimeGoalChange,
    handleSelectWeek,
    handleSelectMonth
  } = useHomeData();

  // Đọc theme đang được chọn từ danh sách dynamic theme list
  const availableThemes = getThemeList();
  const themeConfig = availableThemes.find(t => t.id === themeBoost) || defaultTheme;

  // Danh sách các tháng để hiển thị tabs dọc theo ngôn ngữ
  const months = i18n.language === 'vi'
    ? ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12']
    : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Danh sách các số tuần để hiển thị động theo ngôn ngữ
  const weeks = [1, 2, 3, 4, 5];

  return (
    <div className="h-screen max-h-screen w-screen overflow-hidden bg-[#FDFBF7] dark:bg-zinc-950 p-3 md:p-4 flex flex-col items-center justify-center relative font-outfit transition-colors duration-200">
      
      {/* Cấu trúc cha bọc Planner và Tabs tháng dọc để chống bị overflow-hidden cắt */}
      <div className="w-full h-full max-h-full flex items-stretch gap-0 relative overflow-hidden pr-12 lg:pr-0">
        
        {/* KHUNG PLANNER LỚN CHÍNH (Tiêu thụ trực tiếp từ themeConfig) */}
        <div className={themeConfig.plannerWrapper}>
          
          {/* ---------------- CỘT TRÁI: TIMEBLOCK ---------------- */}
          <div className="w-full lg:w-[40%] h-full max-h-full flex flex-col gap-3 overflow-hidden">
            <div className={themeConfig.headerDivider}>
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-black uppercase tracking-widest text-zinc-400 dark:text-zinc-550 select-none">
                  {t('home.selectedMonth')}: {pageData.selectedMonth}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-extrabold text-sm text-zinc-900 dark:text-zinc-100 select-none">{t('home.date')}:</span>
                  <span className="font-bold text-zinc-750 dark:text-zinc-300 border-b-2 border-dashed border-zinc-450 dark:border-zinc-700 pb-0.5 leading-none pr-8 select-none">
                    {pageData.date}
                  </span>
                </div>
              </div>

              {/* Nút Điều khiển Hệ thống tích hợp làm Toolbar Widget */}
              <Toolbar 
                currentLanguage={i18n.language}
                resolvedTheme={resolvedTheme}
                toggleLanguage={toggleLanguage}
                toggleTheme={toggleTheme}
                logout={logout}
                logoutLabel={t('home.logout')}
                themeBoost={themeBoost}
                toggleThemeBoost={toggleThemeBoost}
                themeConfig={themeConfig}
              />
            </div>
            
            {/* Timeblock Component dùng chung */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <Timeblock 
                events={pageData.events} 
                startHour={0} 
                endHour={23} 
                hourHeight={40} 
                title={t('home.todayTimeblock')}
                dayModeLabel={t('home.dayMode')}
                themeConfig={themeConfig}
              />
            </div>
          </div>

          {/* ---------------- CỘT PHẢI: WEEKS, REMINDERS, MATRIX, NOTES ---------------- */}
          <div className="w-full lg:w-[60%] h-full max-h-full flex flex-col gap-4 overflow-hidden">
            
            {/* 1. TABS TUẦN (Week Buttons) */}
            <WeekSelector 
              weeks={weeks}
              selectedWeek={pageData.selectedWeek}
              onSelectWeek={handleSelectWeek}
              currentLanguage={i18n.language}
              themeConfig={themeConfig}
            />

            {/* 2. REMINDER LABELS (Khung nét đứt) */}
            <ReminderList 
              reminders={pageData.reminders}
              selectedWeek={pageData.selectedWeek}
              onToggleReminder={handleToggleReminder}
              currentLanguage={i18n.language}
              titleLabel={t('home.reminders')}
              themeConfig={themeConfig}
            />
   
            {/* 3. GRATITUDE QUOTE (Lời nhắc nhở tạo động lực) */}
            <GratitudeCard 
              quote={pageData.gratitudeQuote} 
              themeConfig={themeConfig}
            />
   
            {/* 4. EISENHOWER MATRIX */}
            <EisenhowerMatrix 
              matrix={pageData.matrix}
              onToggleDoTask={handleToggleDoTask}
              t={t}
              themeConfig={themeConfig}
            />

            {/* 5. GHI CHÉP MỤC TIÊU Bullet Journal */}
            <div className="flex flex-col mt-2 flex-shrink-0">
              <input
                type="text"
                value={pageData.dailyGoal || ''}
                onChange={(e) => handleTimeGoalChange(e.target.value)}
                className={themeConfig.dailyGoalInput}
              />
            </div>

          </div>

        </div>

        {/* TABS THÁNG DỌC (NẰM DỌC CẠNH PHẢI NGOÀI PLANNER) */}
        <MonthTabs 
          months={months}
          selectedMonth={pageData.selectedMonth}
          onSelectMonth={handleSelectMonth}
          themeConfig={themeConfig}
        />

      </div>
    </div>
  );
}
