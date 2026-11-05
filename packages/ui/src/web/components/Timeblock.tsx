import { useMemo, useEffect, useState } from 'react';
import { calculateEventPositions, RawEvent } from '@zenner/core/util/calendar-layout';
import { TimeblockThemeConfig } from '@zenner/core/theme/themeConfig';

export interface TimeblockEvent extends RawEvent {
  id: string;
  title: string;
  note?: string; // Ghi chú sự kiện (hiển thị thay thế khoảng thời gian)
  color?: string; // Lớp CSS Tailwind cho nền, viền và màu chữ
}

const defaultTimeblockTheme: TimeblockThemeConfig = {
  id: 'default',
  timeblockContainer: "flex flex-col h-full bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden select-none",
  timeblockHeader: "px-4 py-2.5 border-b border-border bg-muted/40 flex justify-between items-center",
  timeblockModeLabel: "text-[9px] font-bold px-2 py-0.5 rounded bg-secondary text-secondary-foreground",
  timeblockTimeAxis: "w-16 border-r border-border bg-muted/20 flex flex-col",
  timeblockGridLine: "absolute left-0 right-0 border-b border-border/40",
  timeblockEventCard: "absolute rounded-lg overflow-hidden flex flex-col transition-all hover:opacity-90 active:scale-[0.99] cursor-pointer shadow-sm"
};

interface TimeblockProps {
  events: TimeblockEvent[];
  startHour?: number;
  endHour?: number;
  hourHeight?: number;
  title?: string;
  dayModeLabel?: string;
  themeConfig?: TimeblockThemeConfig;
}

export function Timeblock({
  events,
  startHour = 0,
  endHour = 23,
  hourHeight = 40,
  title = "Today's Timeblock",
  dayModeLabel,
  themeConfig
}: TimeblockProps) {
  const config = themeConfig || defaultTimeblockTheme;
  const isJournal = config.id === 'journal';

  // Đồng bộ thời gian hiện tại để cập nhật vạch thời gian thực
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // Cập nhật mỗi phút
    return () => clearInterval(timer);
  }, []);

  // Tính toán vị trí của các sự kiện
  const positionedEvents = useMemo(() => {
    return calculateEventPositions(events, startHour, hourHeight);
  }, [events, startHour, hourHeight]);

  // Tạo trục giờ hiển thị
  const hours = useMemo(() => {
    const list = [];
    for (let h = startHour; h <= endHour; h++) {
      list.push(h);
    }
    return list;
  }, [startHour, endHour]);

  const contentHeight = hours.length * hourHeight;

  // Tính toán vị trí vạch giờ hiện tại
  const currentTimePosition = useMemo(() => {
    const hoursNow = now.getHours();
    const minutesNow = now.getMinutes();
    
    if (hoursNow < startHour || hoursNow > endHour) {
      return null;
    }
    
    const offsetMinutes = (hoursNow * 60 + minutesNow) - (startHour * 60);
    return (offsetMinutes / 60) * hourHeight;
  }, [now, startHour, endHour, hourHeight]);

  return (
    <div className={config.timeblockContainer}>
      {/* Header Lịch (Đã bỏ nhãn chế độ ngày) */}
      <div className={config.timeblockHeader}>
        <span className="font-sans font-bold text-foreground text-sm tracking-wider uppercase select-none">
          {title}
        </span>
        {dayModeLabel && (
          <span className={config.timeblockModeLabel}>
            {dayModeLabel}
          </span>
        )}
      </div>

      {/* Grid chứa lịch trình */}
      <div className="flex-1 overflow-y-auto relative [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex relative" style={{ height: `${contentHeight}px` }}>
          
          {/* Trục dọc hiển thị giờ (Time Axis) */}
          <div className={config.timeblockTimeAxis}>
            {hours.map((hour) => (
              <div
                key={hour}
                className="text-right pr-3 text-[11px] font-medium text-muted-foreground font-mono relative select-none"
                style={{
                  height: `${hourHeight}px`,
                  lineHeight: '22px', // Căn chỉnh văn bản lên đầu mốc giờ
                }}
              >
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>

          {/* Lưới thời gian và Sự kiện (Grid Content) */}
          <div className="flex-1 relative bg-muted/5">
            {/* Vẽ đường kẻ ngang phân cách mỗi giờ */}
            {hours.map((_, idx) => (
              <div
                key={`grid-line-${idx}`}
                className={config.timeblockGridLine}
                style={{
                  top: `${(idx + 1) * hourHeight}px`,
                }}
              />
            ))}

            {/* Render các Sự kiện */}
            {events.map((event, idx) => {
              const pos = positionedEvents[idx];
              if (!pos) return null;

              // Sự kiện chỉ đủ 1 hàng nếu chiều cao khối nhỏ hơn 36px
              const isSingleRow = pos.height < 36;

              // Chuẩn hóa màu sự kiện theo xu hướng Modern Minimal (tinh tế, không chói gắt, không ngẫu nhiên nhiều màu)
              const getModernMinimalColor = (rawColor?: string) => {
                if (!rawColor) {
                  return 'border-l-primary bg-primary/8 dark:bg-primary/10 text-foreground';
                }

                // Nếu đã sử dụng định dạng Modern Minimal với border-l thì dùng trực tiếp
                if (rawColor.includes('border-l-')) {
                  return rawColor;
                }

                // Chuyển đổi màu legacy sang bảng màu Modern Minimal Zen
                if (rawColor.includes('blue') || rawColor.includes('sky')) {
                  return 'border-l-sky-500/80 bg-sky-500/8 dark:bg-sky-500/10 text-foreground';
                }
                if (rawColor.includes('emerald') || rawColor.includes('green')) {
                  return 'border-l-primary bg-primary/8 dark:bg-primary/12 text-foreground';
                }
                if (rawColor.includes('amber') || rawColor.includes('yellow') || rawColor.includes('orange')) {
                  return 'border-l-amber-500/80 bg-amber-500/8 dark:bg-amber-500/10 text-foreground';
                }
                if (rawColor.includes('purple') || rawColor.includes('pink') || rawColor.includes('rose')) {
                  return 'border-l-primary/80 bg-primary/8 dark:bg-primary/10 text-foreground';
                }

                return 'border-l-muted-foreground/60 bg-muted/40 text-foreground';
              };

              const modernColorClass = getModernMinimalColor(event.color);
              const eventCardClass = `${config.timeblockEventCard} border-l-[3.5px] ${modernColorClass}`;

              // Tính toán định dạng thời gian và khoảng thời lượng
              const parseTime = (t: string) => {
                const [hStr, mStr] = t.split(':');
                const h = parseInt(hStr, 10);
                const m = parseInt(mStr, 10);
                return { h, m, totalMinutes: h * 60 + m };
              };

              const tStart = parseTime(event.startTime);
              const tEnd = parseTime(event.endTime);

              const formatPart = (t: { h: number; m: number }) => {
                if (t.m === 0) return `${t.h}:00`;
                return `${t.h}:${t.m < 10 ? '0' + t.m : t.m}`;
              };

              const startFormatted = formatPart(tStart);
              const endFormatted = formatPart(tEnd);

              const diffMin = tEnd.totalMinutes - tStart.totalMinutes;
              const diffH = Math.floor(diffMin / 60);
              const diffM = diffMin % 60;

              let durationFormatted = '';
              if (diffH > 0 && diffM > 0) {
                durationFormatted = `${diffH}h${diffM}m`;
              } else if (diffH > 0) {
                durationFormatted = `${diffH}h`;
              } else {
                durationFormatted = `${diffM}m`;
              }

              return (
                <div
                  key={event.id}
                  className={`${eventCardClass} ${
                    isSingleRow ? 'px-2.5 py-0.5 justify-center' : 'px-2.5 py-1.5 justify-start gap-0.5'
                  }`}
                  style={{
                    top: `${pos.top + 2}px`,
                    height: `${Math.max(22, pos.height - 4)}px`,
                    left: `${isJournal ? pos.left : pos.left + 0.5}%`,
                    width: `calc(${isJournal ? pos.width : pos.width - 1}% - 6px)`,
                    marginRight: '3px',
                    marginLeft: '3px',
                    zIndex: isSingleRow ? 10 : 1,
                  }}
                  title={`${event.title} (${startFormatted} - ${endFormatted})`}
                >
                  {isSingleRow ? (
                    // Chỉ đủ 1 hàng: bỏ dòng thời gian riêng, ưu tiên label + khoảng thời gian kế bên
                    <div className="flex items-center gap-1.5 w-full min-w-0 leading-none">
                      <span className="font-medium text-[11px] text-foreground truncate">
                        {event.title}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                        ({durationFormatted})
                      </span>
                    </div>
                  ) : (
                    // Đủ từ 2 hàng trở lên: hiển thị label và thời gian phía dưới
                    <>
                      <span className="font-semibold text-xs text-foreground truncate leading-snug block">
                        {event.title}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground truncate leading-tight block">
                        {startFormatted} - {endFormatted} ({durationFormatted})
                      </span>
                      {pos.height >= 60 && event.note && (
                        <span className="text-[10px] text-muted-foreground/75 truncate block italic">
                          {event.note}
                        </span>
                      )}
                    </>
                  )}
                </div>
              );
            })}

            {/* Vạch chỉ giờ hiện tại (Current Time Marker Line) */}
            {currentTimePosition !== null && (
              <div 
                className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
                style={{ top: `${currentTimePosition}px` }}
              >
                <div className="w-2 h-2 rounded-full bg-destructive -ml-1 flex-shrink-0" />
                <div className="flex-1 h-[1.5px] bg-destructive/80" />
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
