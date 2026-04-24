import { useState, useEffect } from 'react';
import type { PendingEventDialog, EventDialogLine } from '../types/game';
import { Sparkles, ChevronRight, X, BookOpen } from 'lucide-react';

type Props = {
  data: PendingEventDialog;
  onClose: () => void;
};

function lineStyle(line: EventDialogLine): { label: string; className: string } {
  switch (line.role) {
    case 'narration':
      return { label: '旁白', className: 'text-zinc-300 italic' };
    case 'self':
      return { label: '你', className: 'text-sky-200/95' };
    case 'other':
      return { label: line.name || '某人', className: 'text-amber-200/90' };
    case 'system':
      return { label: '提示', className: 'text-emerald-400/90 text-sm font-medium' };
    default:
      return { label: '', className: 'text-zinc-300' };
  }
}

export function RandomEventModal({ data, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [showEffects, setShowEffects] = useState(false);

  useEffect(() => {
    setStep(0);
    setShowEffects(false);
  }, [data.eventId]);

  const isSummaryStep = step >= data.lines.length;
  const toneBorder = data.isHardNegative
    ? 'border-red-900/70'
    : data.isPositive
      ? 'border-emerald-800/60'
      : 'border-amber-900/60';
  const toneTitle = data.isHardNegative ? 'text-red-200' : data.isPositive ? 'text-emerald-300' : 'text-amber-200';

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/65 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="随机事件"
    >
      <div
        className={`w-full max-w-lg bg-zinc-900 border ${toneBorder} rounded-3xl shadow-2xl relative max-h-[88vh] flex flex-col`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 p-2 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800 z-10"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 pb-2 pr-14 flex items-center gap-2">
          <Sparkles className={`w-5 h-5 shrink-0 ${data.isPositive ? 'text-emerald-400' : 'text-amber-400'}`} />
          <h2 className={`text-xl font-semibold leading-snug ${toneTitle}`}>{data.title}</h2>
        </div>

        <div className="px-6 flex-1 min-h-0 overflow-y-auto">
          {!isSummaryStep && data.lines[step] ? (
            <div className="py-4 space-y-2">
              <div className="text-[10px] uppercase tracking-wider text-zinc-500">
                {lineStyle(data.lines[step]).label}
              </div>
              <p className={`text-sm leading-relaxed ${lineStyle(data.lines[step]).className}`}>
                {data.lines[step].text}
              </p>
              <p className="text-[10px] text-zinc-600 pt-2">
                第 {step + 1} / {data.lines.length} 段 · 游戏化叙事，不替代医疗
              </p>
            </div>
          ) : (
            <div className="py-4 space-y-4">
              <p className="text-sm text-zinc-400">本段故事已告一段落。下面是仅针对「这条随机事件」的游戏内波动感（非化验单）。</p>
              <button
                type="button"
                onClick={() => setShowEffects((v) => !v)}
                className="w-full text-left flex items-center justify-between gap-2 py-2 px-3 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-xs text-zinc-300 hover:bg-zinc-800"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-zinc-500" />
                  {showEffects ? '收起波动说明' : '展开波动说明'}
                </span>
                <ChevronRight
                  className={`w-4 h-4 text-zinc-500 transition-transform ${showEffects ? 'rotate-90' : ''}`}
                />
              </button>
              {showEffects && (
                <p className="text-sm text-zinc-300 leading-relaxed border-l-2 border-zinc-600 pl-3">
                  {data.effectsSummary}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="p-6 pt-2 border-t border-zinc-800/80 space-y-2 shrink-0">
          <p className="text-[10px] text-zinc-600 text-center">以上为艺术化表现；如有不适请就医，勿以本界面自我诊断。</p>
          <div className="flex flex-wrap gap-2 justify-end">
            {!isSummaryStep && (
              <>
                <button
                  type="button"
                  onClick={() => setStep((s) => Math.min(s + 1, data.lines.length))}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium flex items-center gap-1"
                >
                  {step < (data.lines.length > 0 ? data.lines.length - 1 : 0) ? '下一段' : '看结算'}
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setStep(data.lines.length)}
                  className="px-3 py-2.5 rounded-xl text-xs text-zinc-500 hover:text-zinc-300"
                >
                  跳过到波动说明
                </button>
              </>
            )}
            {isSummaryStep && (
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-zinc-100 hover:bg-white text-zinc-900 text-sm font-medium"
              >
                知道了
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
