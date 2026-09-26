import { useMemo } from 'react';
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	createColumnHelper,
} from '@tanstack/react-table';
import { DoTask, ScheduleTask, DelegateTask, DeleteTask } from '../mockData';
import { ThemeConfig } from '@zenner/core/theme/themeConfig';

interface EisenhowerMatrixProps {
	matrix: {
		do: DoTask[];
		schedule: ScheduleTask[];
		delegate: DelegateTask[];
		delete: DeleteTask[];
	};
	onToggleDoTask: (taskId: string) => void;
	t: (key: string) => string;
	themeConfig: ThemeConfig;
}

export function EisenhowerMatrix({
	matrix,
	onToggleDoTask,
	t,
	themeConfig,
}: EisenhowerMatrixProps) {
	const doColumnHelper = createColumnHelper<DoTask>();
	const doColumns = useMemo(
		() => [
			doColumnHelper.accessor('task', {
				header: () => t('home.taskDo'),
				cell: (info) => {
					const isDone = info.row.original.done;
					return (
						<span
							className={
								isDone
									? 'line-through text-zinc-400 dark:text-zinc-550 font-medium'
									: 'text-zinc-800 dark:text-zinc-200 font-semibold'
							}
						>
							{info.getValue()}
						</span>
					);
				},
			}),
			doColumnHelper.accessor('done', {
				header: () => '',
				cell: (info) => {
					const isDone = info.getValue();
					return (
						<button
							onClick={() => onToggleDoTask(info.row.original.id)}
							className={
								isDone
									? themeConfig.matrixCheckboxActive
									: themeConfig.matrixCheckboxInactive
							}
						>
							{isDone && (
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="10"
									height="10"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="3.5"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							)}
						</button>
					);
				},
			}),
		],
		[t, onToggleDoTask, themeConfig],
	);

	const doTable = useReactTable({
		data: matrix.do,
		columns: doColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	const scheduleColumnHelper = createColumnHelper<ScheduleTask>();
	const scheduleColumns = useMemo(
		() => [
			scheduleColumnHelper.accessor('task', {
				header: () => t('home.taskTodo'),
				cell: (info) => (
					<span className="text-zinc-800 dark:text-zinc-200 font-semibold">
						{info.getValue()}
					</span>
				),
			}),
			scheduleColumnHelper.accessor('when', {
				header: () => t('home.when'),
				cell: (info) => (
					<span className="text-zinc-500 font-mono text-xs">
						{info.getValue()}
					</span>
				),
			}),
		],
		[t],
	);

	const scheduleTable = useReactTable({
		data: matrix.schedule,
		columns: scheduleColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	const delegateColumnHelper = createColumnHelper<DelegateTask>();
	const delegateColumns = useMemo(
		() => [
			delegateColumnHelper.accessor('task', {
				header: () => t('home.taskDelegate'),
				cell: (info) => (
					<span className="text-zinc-800 dark:text-zinc-200 font-semibold">
						{info.getValue()}
					</span>
				),
			}),
			delegateColumnHelper.accessor('who', {
				header: () => t('home.whoCanDoIt'),
				cell: (info) => (
					<span className="text-blue-600 dark:text-blue-400 font-bold text-xs bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.5 rounded border border-blue-200 dark:border-blue-900">
						{info.getValue()}
					</span>
				),
			}),
		],
		[t],
	);

	const delegateTable = useReactTable({
		data: matrix.delegate,
		columns: delegateColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	const deleteColumnHelper = createColumnHelper<DeleteTask>();
	const deleteColumns = useMemo(
		() => [
			deleteColumnHelper.accessor('task', {
				header: () => t('home.taskDelete'),
				cell: (info) => (
					<span className="text-zinc-400 dark:text-zinc-550 line-through decoration-rose-500/60 decoration-2 font-medium">
						{info.getValue()}
					</span>
				),
			}),
		],
		[t],
	);

	const deleteTable = useReactTable({
		data: matrix.delete,
		columns: deleteColumns,
		getCoreRowModel: getCoreRowModel(),
	});

	// Reusable mini-table renderer
	const renderTable = (
		table: ReturnType<
			typeof useReactTable<DoTask | ScheduleTask | DelegateTask | DeleteTask>
		>,
	) => (
		<div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
			<table className="w-full text-left border-collapse text-[11px]">
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id} className={themeConfig.matrixTableHeader}>
									{flexRender(
										header.column.columnDef.header,
										header.getContext(),
									)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id} className={themeConfig.matrixRowHover}>
							{row.getVisibleCells().map((cell) => (
								<td
									key={cell.id}
									className="py-1 px-1 border-b border-zinc-100 dark:border-zinc-800/50"
								>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);

	return (
		<div className="flex-1 min-h-0 flex flex-col gap-2 overflow-hidden">
			<span className="text-xs font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-300 flex-shrink-0">
				{t('home.eisenhowerTitle')}
			</span>

			{/* Wrapper: label dọc bên trái + lưới chính bên phải */}
			<div className="flex-1 min-h-0 flex overflow-hidden">
				{/* Cột nhãn dọc "Quan trọng" / "Không quan trọng" */}
				<div className="hidden sm:flex flex-col w-7 flex-shrink-0 mr-1">
					{/* Ô trống góc trên cùng (tương ứng header row) */}
					<div className="h-7 flex-shrink-0" />
					{/* Nhãn QUAN TRỌNG */}
					<div className="flex-1 flex items-center justify-center">
						<span className={themeConfig.matrixImportantRow}>
							{t('home.important')}
						</span>
					</div>
					{/* Nhãn KHÔNG QUAN TRỌNG */}
					<div className="flex-1 flex items-center justify-center">
						<span className={themeConfig.matrixUnimportantRow}>
							{t('home.unimportant')}
						</span>
					</div>
				</div>

				{/* Lưới chính 2x2 + header row */}
				<div className="flex-1 min-w-0 flex flex-col overflow-hidden">
					{/* Header row: 2 cột tiêu đề */}
					<div className="hidden sm:grid grid-cols-2 gap-px flex-shrink-0 mb-px">
						<div className={themeConfig.matrixUrgentHeader}>
							{t('home.urgent')}
						</div>
						<div className={themeConfig.matrixNotUrgentHeader}>
							{t('home.notUrgent')}
						</div>
					</div>

					{/* Lưới 2x2 với border chung tạo thành đường kẻ */}
					<div className={themeConfig.matrixContainer}>
						{/* Ô 1: DO — Khẩn cấp & Quan trọng (trái trên) */}
						<div className={`${themeConfig.matrixCell} matrix-cell-left`}>
							<div className="sm:hidden text-[10px] font-black text-rose-600 uppercase mb-1">
								{t('home.urgent')} · {t('home.important')}
							</div>
							{renderTable(doTable as never)}
						</div>

						{/* Ô 2: SCHEDULE — Không khẩn cấp & Quan trọng (phải trên) */}
						<div className={themeConfig.matrixCell}>
							<div className="sm:hidden text-[10px] font-black text-amber-600 uppercase mb-1">
								{t('home.notUrgent')} · {t('home.important')}
							</div>
							{renderTable(scheduleTable as never)}
						</div>

						{/* Ô 3: DELEGATE — Khẩn cấp & Không quan trọng (trái dưới) */}
						<div
							className={`${themeConfig.matrixCell} matrix-cell-left matrix-cell-divider`}
						>
							<div className="sm:hidden text-[10px] font-black text-rose-600 uppercase mb-1">
								{t('home.urgent')} · {t('home.unimportant')}
							</div>
							{renderTable(delegateTable as never)}
						</div>

						{/* Ô 4: DELETE — Không khẩn cấp & Không quan trọng (phải dưới) */}
						<div className={`${themeConfig.matrixCell} matrix-cell-divider`}>
							<div className="sm:hidden text-[10px] font-black text-zinc-500 uppercase mb-1">
								{t('home.notUrgent')} · {t('home.unimportant')}
							</div>
							{renderTable(deleteTable as never)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
