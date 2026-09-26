import { ThemeConfig } from '@zenner/core/theme/themeConfig';

interface Reminder {
	id: string;
	label: string;
	value: 'Y' | 'N';
}

interface ReminderListProps {
	reminders: Reminder[];
	selectedWeek: string;
	onToggleReminder: (reminderId: string) => void;
	currentLanguage: string;
	titleLabel: string;
	themeConfig: ThemeConfig;
}

export function ReminderList({
	reminders,
	selectedWeek,
	onToggleReminder,
	currentLanguage,
	titleLabel,
	themeConfig,
}: ReminderListProps) {
	// Dịch động nhãn tuần trong tiêu đề nhắc nhở
	const translatedWeek =
		currentLanguage === 'vi'
			? selectedWeek.replace('Week', 'Tuần')
			: selectedWeek;

	return (
		<div className={themeConfig.reminderList}>
			<span className="text-xs font-black uppercase tracking-wider text-zinc-850 dark:text-zinc-300 mb-0.5 block flex-shrink-0">
				{titleLabel} ({translatedWeek})
			</span>
			{reminders.map((rem) => {
				const isYes = rem.value === 'Y';
				const isNo = rem.value === 'N';

				return (
					<div
						key={rem.id}
						className="flex items-center justify-between gap-4 pb-1.5 border-b border-dashed border-zinc-200 dark:border-zinc-800 last:border-0"
					>
						<span className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 leading-snug">
							• {rem.label}
						</span>

						{/* Nút toggle Y/N được cấu hình hoàn toàn từ theme config */}
						<div className={themeConfig.reminderToggleContainer}>
							<button
								onClick={() => onToggleReminder(rem.id)}
								className={
									isYes
										? themeConfig.reminderToggleActiveY
										: themeConfig.reminderToggleInactive
								}
							>
								Y
							</button>

							{themeConfig.reminderToggleSeparator && (
								<div className={themeConfig.reminderToggleSeparator} />
							)}

							<button
								onClick={() => onToggleReminder(rem.id)}
								className={
									isNo
										? themeConfig.reminderToggleActiveN
										: themeConfig.reminderToggleInactive
								}
							>
								N
							</button>
						</div>
					</div>
				);
			})}
		</div>
	);
}
