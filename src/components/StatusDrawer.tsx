import { useState } from 'react';
import { useNovelStore } from '../stores/useNovelStore';
import {
  RELATION_LABELS,
  type NovelEffects,
  type NovelRelations,
} from '../types/novel';

interface StatusDrawerProps {
  effects: NovelEffects;
}

function bar(value: number, max = 100, color = 'bg-emerald-500') {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
      <div className={`h-full ${color} transition-all`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function relationBar(value: number) {
  // -100..100 -> 0..100 居中
  const pct = ((value + 100) / 200) * 100;
  const color = value >= 30 ? 'bg-emerald-500' : value <= -30 ? 'bg-rose-500' : 'bg-zinc-500';
  return (
    <div className="relative h-1.5 bg-zinc-800 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} transition-all`}
        style={{ width: `${pct}%` }}
      />
      <div
        className="absolute top-0 bottom-0 w-px bg-zinc-600/60"
        style={{ left: '50%' }}
      />
    </div>
  );
}

function relationTone(value: number): string {
  if (value >= 60) return '亲近';
  if (value >= 30) return '信任';
  if (value >= 10) return '相熟';
  if (value > -10) return '点头之交';
  if (value > -30) return '生分';
  return '冷淡';
}

export function StatusDrawer({ effects }: StatusDrawerProps) {
  const prefs = useNovelStore((s) => s.state.prefs);
  const togglePref = useNovelStore((s) => s.togglePref);
  const setSpeed = useNovelStore((s) => s.setTypewriterSpeed);
  const [openPrefs, setOpenPrefs] = useState(false);

  return (
    <aside className="w-full lg:w-[260px] shrink-0 lg:border-l lg:border-zinc-800/70 lg:pl-5">
      <div className="space-y-5">
        <section>
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">
            状态
          </div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-zinc-400">健康</span>
                <span className="text-sm font-mono text-emerald-300">{effects.health}</span>
              </div>
              {bar(effects.health, 100, 'bg-emerald-500')}
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-xs text-zinc-400">羞耻</span>
                <span className="text-sm font-mono text-amber-300">{effects.shame}</span>
              </div>
              {bar(effects.shame, 100, 'bg-amber-500')}
            </div>
          </div>
        </section>

        <section>
          <div className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2">
            关系
          </div>
          <div className="space-y-2.5">
            {(Object.keys(RELATION_LABELS) as (keyof NovelRelations)[]).map((k) => {
              const v = effects.relations[k];
              return (
                <div key={k}>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="text-xs text-zinc-400">
                      {RELATION_LABELS[k]}
                    </span>
                    <span className="text-[11px] text-zinc-500">{relationTone(v)}</span>
                  </div>
                  {relationBar(v)}
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-zinc-800/70 pt-3">
          <button
            type="button"
            onClick={() => setOpenPrefs((p) => !p)}
            className="w-full flex justify-between items-center text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <span className="uppercase tracking-[0.2em]">阅读偏好</span>
            <span>{openPrefs ? '收起' : '展开'}</span>
          </button>
          {openPrefs && (
            <div className="mt-3 space-y-3 text-xs text-zinc-400">
              <label className="flex items-center justify-between">
                <span>打字机</span>
                <input
                  type="checkbox"
                  checked={prefs.typewriter}
                  onChange={() => togglePref('typewriter')}
                  className="accent-emerald-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span>显示选项提示</span>
                <input
                  type="checkbox"
                  checked={prefs.showHints}
                  onChange={() => togglePref('showHints')}
                  className="accent-emerald-500"
                />
              </label>
              <div>
                <div className="mb-1.5 text-zinc-500">速度</div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: '慢', v: 40 },
                    { label: '中', v: 28 },
                    { label: '快', v: 16 },
                  ].map((opt) => (
                    <button
                      key={opt.v}
                      type="button"
                      onClick={() => setSpeed(opt.v)}
                      className={`py-1 rounded border text-[11px] ${
                        prefs.typewriterSpeed === opt.v
                          ? 'bg-emerald-600/20 border-emerald-500/50 text-emerald-200'
                          : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </aside>
  );
}
