import type { GameState, PlayerGoal } from '../types/game';
import { getGoalCompletionPercent } from '../lib/goalProgress';
import { Target, Flame } from 'lucide-react';

const goalCopy: Record<
  PlayerGoal,
  { title: string; detail: string }
> = {
  uric: {
    title: '课题：把指数压下来',
    detail: '累计 6 个月结算时「尿酸相关指数」< 50（每月满足 +1，可超 6 继续累加）。',
  },
  balance: {
    title: '课题：压力与指数平衡',
    detail: '连续满足：压力 < 65 且尿酸相关指数 < 70（中断则重新计数）。',
  },
  knowledge: {
    title: '课题：搞懂这件事',
    detail: '连续 3 个月疾病知识 > 60%。',
  },
  relationship: {
    title: '课题：把支持网织牢',
    detail: '连续 3 个月人际支持 > 72%。',
  },
};

type Props = {
  state: GameState;
  compact?: boolean;
};

export function GoalAndFeedbackPanel({ state, compact }: Props) {
  const g = state.playerGoal;
  const pct = getGoalCompletionPercent(g, state.goalProgress);
  const copy = goalCopy[g];
  const streak = state.goalProgress.consecutiveGoodMonths;
  const feedback = state.lastTurn?.feedbackLine;

  return (
    <div
      className={`rounded-2xl border border-zinc-800 bg-zinc-900/40 ${compact ? 'p-3 mb-0' : 'p-6 mb-8'}`}
    >
      <div className={`flex items-center gap-2 ${compact ? 'mb-2' : 'mb-4'}`}>
        <Target className={`text-emerald-500/90 ${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
        <h2 className={`font-semibold text-white tracking-wide ${compact ? 'text-xs' : 'text-sm'}`}>
          本局课题与反馈
        </h2>
      </div>

      <div className={compact ? 'space-y-2' : 'space-y-4'}>
        <div>
          <div className={`text-emerald-100/90 font-medium ${compact ? 'text-xs' : 'text-base'}`}>
            {copy.title}
          </div>
          {!compact && <p className="text-xs text-zinc-500 mt-1 leading-relaxed">{copy.detail}</p>}
        </div>

        <div>
          <div className="flex justify-between text-[10px] text-zinc-500 mb-0.5">
            <span>课题完成度</span>
            <span>{pct}%</span>
          </div>
          <div className={`${compact ? 'h-1.5' : 'h-2'} rounded-full bg-zinc-800 overflow-hidden`}>
            <div
              className="h-full bg-gradient-to-r from-emerald-700 to-emerald-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className={`flex items-start gap-1.5 ${compact ? 'text-xs' : 'text-sm'} text-zinc-400`}>
          <Flame className={`text-orange-400 shrink-0 mt-0.5 ${compact ? 'w-3.5 h-3.5' : 'w-4 h-4'}`} />
          <span className="leading-snug">
            连击 <span className="text-zinc-200 font-mono">{streak}</span> 月
            {!compact && streak >= 3 && (
              <span className="text-zinc-500">（3/6/12 有阶段提示）</span>
            )}
          </span>
        </div>

        {feedback && (
          <div
            className={`rounded-xl bg-zinc-800/60 border border-zinc-700/50 text-amber-100/90 ${compact ? 'px-2 py-1.5 text-[11px] line-clamp-2' : 'px-4 py-3 text-sm'}`}
          >
            {feedback}
          </div>
        )}
      </div>
    </div>
  );
}
