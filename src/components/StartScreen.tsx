import { useState } from 'react';
import { ALL_CHAPTERS, useNovelStore } from '../stores/useNovelStore';
import { DisclaimerFooter } from './DisclaimerFooter';

export function StartScreen() {
  const state = useNovelStore((s) => s.state);
  const startNew = useNovelStore((s) => s.startNewNovel);
  const cont = useNovelStore((s) => s.continueReading);
  const enter = useNovelStore((s) => s.enterChapter);
  const reset = useNovelStore((s) => s.resetAll);

  const hasProgress = !!state.chapterId;
  const [showChapterList, setShowChapterList] = useState(false);

  const unlockedSet = new Set(state.unlockedChapters);
  // 当前正在读但还没读完的章节也允许跳回
  if (state.chapterId) unlockedSet.add(state.chapterId);

  return (
    <div className="min-h-dvh w-full bg-gradient-to-b from-zinc-950 to-zinc-900 text-zinc-100 flex items-center justify-center px-6 py-10">
      <div className="max-w-md w-full space-y-10">
        <div className="text-center space-y-3">
          <div className="text-[11px] tracking-[0.5em] text-zinc-500">
            互动小说
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-wide">
            高尿酸人生
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            一个普通本科机械专业男生,大学四年的故事。
            <br />
            你做的每一个选择,他都得自己扛。
          </p>
        </div>

        {!showChapterList ? (
          <div className="space-y-2.5">
            {hasProgress && (
              <button
                type="button"
                onClick={cont}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white tracking-widest text-sm transition-colors"
              >
                继续阅读
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (!hasProgress || confirm('已有进度,开始新阅读会重置进度,确定继续?')) {
                  startNew();
                }
              }}
              className={`w-full py-3 rounded-xl border tracking-widest text-sm transition-colors ${
                hasProgress
                  ? 'border-zinc-700 hover:border-zinc-500 text-zinc-300'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600'
              }`}
            >
              {hasProgress ? '从头开始' : '开始阅读'}
            </button>
            <button
              type="button"
              onClick={() => setShowChapterList(true)}
              className="w-full py-3 rounded-xl border border-zinc-800 hover:border-zinc-600 text-zinc-400 tracking-widest text-sm transition-colors"
            >
              章节选择
            </button>
            {hasProgress && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('清除全部存档?这会回到最初。')) reset();
                }}
                className="w-full py-2 text-[11px] text-zinc-600 hover:text-zinc-400 underline-offset-4 hover:underline"
              >
                清除存档
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-[11px] tracking-[0.3em] text-zinc-500">
                章节列表
              </div>
              <button
                type="button"
                onClick={() => setShowChapterList(false)}
                className="text-[11px] text-zinc-500 hover:text-zinc-300"
              >
                返回
              </button>
            </div>
            <ul className="space-y-1.5 max-h-[55vh] overflow-y-auto pr-1">
              {ALL_CHAPTERS.map((c) => {
                const isUnlocked = unlockedSet.has(c.id) || c.index === 1;
                const isPlaceholder = c.status === 'placeholder';
                return (
                  <li key={c.id}>
                    <button
                      type="button"
                      disabled={!isUnlocked}
                      onClick={() => enter(c.id)}
                      className={`w-full text-left px-3 py-2.5 rounded-lg border transition-colors ${
                        isUnlocked
                          ? 'border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-900/60 text-zinc-200'
                          : 'border-zinc-900 bg-zinc-950 text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[11px] tracking-widest text-zinc-500 shrink-0">
                          CH {String(c.index).padStart(2, '0')}
                        </span>
                        <span className="flex-1 text-sm truncate">
                          {c.title}
                        </span>
                        {isPlaceholder && (
                          <span className="text-[10px] text-amber-500/70 shrink-0">
                            待写
                          </span>
                        )}
                        {!isUnlocked && (
                          <span className="text-[10px] text-zinc-600 shrink-0">
                            未解锁
                          </span>
                        )}
                      </div>
                      {c.subtitle && (
                        <div className="text-[11px] text-zinc-500 mt-0.5 truncate">
                          {c.subtitle}
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <DisclaimerFooter className="!text-zinc-600 !border-zinc-800/60 !bg-zinc-900/40" />
      </div>
    </div>
  );
}
