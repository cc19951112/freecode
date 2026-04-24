import { useState } from 'react';
import type { GameState, LastTurnSnapshot, LifeStage } from '../types/game';
import { ChevronDown, ChevronUp, BookMarked } from 'lucide-react';

const stageNoEventTip: Record<LifeStage, string> = {
  postExam: '这个阶段：多给自己一点缓冲。体检结果只是起点，别急着在焦虑里下结论。',
  college: '大学阶段：课表与社交会拉扯你的作息。试试把「能睡」和「能走」也写进日程里。',
  career: '职场段：会议与指标容易把你钉在桌边。小步打断久坐，对节奏很重要。',
  family: '家庭段：时间被分走是常态。给自己留一点点可执行的管理，不必完美。',
};

const deltaLabel: Record<keyof NonNullable<LastTurnSnapshot['deltas']>, string> = {
  uricAcid: '尿酸指数',
  health: '健康',
  stress: '压力',
  money: '资金',
  knowledge: '知识',
  relationships: '人际',
};

type Props = {
  lastTurn: GameState['lastTurn'];
  lifeStage: LifeStage;
  /** 有科普卡待读时的提示 */
  hasPendingKnowledge: boolean;
  month: number;
  /** 桌面一屏布局：压缩边距与字号 */
  compact?: boolean;
  /** 随机事件已用全屏弹窗呈现时，中栏不重复大段原文 */
  eventFromModal?: boolean;
};

export function EventTurnBanner({
  lastTurn,
  lifeStage,
  hasPendingKnowledge,
  month,
  compact,
  eventFromModal,
}: Props) {
  const [open, setOpen] = useState(!compact);

  const toneClass = (() => {
    if (!lastTurn?.event) return 'border-zinc-700/80 bg-zinc-900/60';
    if (lastTurn.event.isPositive) return 'border-emerald-800/60 bg-emerald-950/40';
    if (lastTurn.event.isHardNegative) return 'border-red-900/60 bg-red-950/25';
    return 'border-amber-900/60 bg-amber-950/30';
  })();

  const eventAccent = (() => {
    if (!lastTurn?.event) return 'text-zinc-300';
    if (lastTurn.event.isPositive) return 'text-emerald-300';
    if (lastTurn.event.isHardNegative) return 'text-red-200/95';
    return 'text-amber-200/90';
  })();

  const deltaBits =
    lastTurn && Object.keys(lastTurn.deltas).length > 0
      ? (Object.entries(lastTurn.deltas) as [keyof typeof deltaLabel, number][])
          .map(([k, v]) => {
            const name = deltaLabel[k];
            const sign = v > 0 ? '+' : '';
            return `${name} ${sign}${v}`;
          })
          .join(' · ')
      : null;

  const pad = compact ? 'p-3 mb-0' : 'p-5 mb-6';
  const titleCls = compact ? 'text-sm' : 'text-lg';
  const bodyCls = compact ? 'text-xs mt-0.5 line-clamp-2' : 'text-sm mt-1';

  return (
    <div
      key={month}
      className={`${pad} rounded-2xl border shadow-lg shadow-black/20 transition-all duration-500 ease-out ${toneClass}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-[9px] uppercase tracking-widest text-zinc-500 mb-0.5">本回合·叙事焦点</div>
          {!lastTurn ? (
            <>
              <h3 className={`${titleCls} font-semibold text-zinc-200`}>准备推进一个月</h3>
              <p className={`${bodyCls} text-zinc-400`}>
                在右侧选一项主行动。结算后这里会显示本月故事与指标变化。
              </p>
            </>
          ) : lastTurn.event ? (
            <>
              <h3 className={`${titleCls} font-semibold leading-snug ${eventAccent}`}>{lastTurn.event.title}</h3>
              {eventFromModal ? (
                <p className={`${bodyCls} text-zinc-500`}>
                  对白与单条事件波动已在弹窗中读过。下表为「全回合主行动+随机故事」的合计变化（仅游戏化数字）。
                </p>
              ) : (
                <p className={`${bodyCls} text-zinc-300 ${compact ? 'line-clamp-2' : 'line-clamp-2'}`}>
                  {lastTurn.event.description}
                </p>
              )}
            </>
          ) : (
            <>
              <h3 className={`${titleCls} font-semibold text-zinc-200`}>本月平平淡淡</h3>
              <p className={`${bodyCls} text-zinc-400 ${compact ? 'line-clamp-2' : ''}`}>
                {stageNoEventTip[lifeStage]}
              </p>
            </>
          )}
        </div>
        {lastTurn?.event && !eventFromModal && (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="shrink-0 flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300"
            aria-expanded={open}
          >
            {open ? '收起' : '详情'}
            {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {lastTurn?.event && open && !compact && !eventFromModal && (
        <p className="text-sm text-zinc-400 mt-3 pl-0 border-t border-zinc-800/80 pt-3 leading-relaxed">
          {lastTurn.event.description}
        </p>
      )}

      {deltaBits && (
        <div
          className={`${compact ? 'mt-2 text-[10px] pt-2' : 'mt-3 text-xs pt-3'} font-mono text-zinc-400 border-t border-zinc-800/60`}
        >
          本回合变化：{deltaBits}
        </div>
      )}

      {hasPendingKnowledge && (
        <div
          className={`${compact ? 'mt-1.5 text-[10px]' : 'mt-3 text-xs'} flex items-center gap-1.5 text-sky-300/90`}
        >
          <BookMarked className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} shrink-0`} />
          科普小卡片已弹出，读完再关即可。
        </div>
      )}
    </div>
  );
}
