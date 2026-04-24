import type {
  Chapter,
  NovelEffects,
  NovelHistoryEntry,
} from '../types/novel';

interface ChapterOutroProps {
  chapter: Chapter;
  effects: NovelEffects;
  history: NovelHistoryEntry[];
  hasNextChapter: boolean;
  onNext: () => void;
  onBackToMenu: () => void;
}

export function ChapterOutro({
  chapter,
  effects,
  history,
  hasNextChapter,
  onNext,
  onBackToMenu,
}: ChapterOutroProps) {
  const chapterChoices = history.filter((h) => h.chapterId === chapter.id);
  const triggeredLines = (chapter.outroLines ?? []).filter(
    (rule) => !rule.whenFlag || effects.flags.includes(rule.whenFlag)
  );
  const isPlaceholder = chapter.status === 'placeholder';

  return (
    <div className="min-h-dvh w-full flex items-center justify-center px-6 py-10 bg-zinc-950 text-zinc-100">
      <div className="max-w-xl w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="text-[11px] tracking-[0.5em] text-zinc-600">
            CHAPTER {String(chapter.index).padStart(2, '0')} · 完
          </div>
          <h2 className="text-2xl font-bold tracking-wide">{chapter.title}</h2>
        </div>

        {isPlaceholder && (
          <section className="text-zinc-400 font-serif leading-[2] text-[15px] text-center border-l-2 border-amber-700/50 pl-5">
            <p>本章正文还在写。后面的故事,等下一次更新见。</p>
          </section>
        )}

        {!isPlaceholder && triggeredLines.length > 0 && (
          <section className="space-y-3 text-zinc-300/90 font-serif leading-[2] text-[15px] border-l-2 border-emerald-700/50 pl-5">
            {triggeredLines.map((rule, i) => (
              <p key={i}>{rule.text}</p>
            ))}
          </section>
        )}

        {chapterChoices.length > 0 && (
          <section>
            <div className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 mb-2">
              你做出的选择
            </div>
            <ul className="space-y-1.5 text-sm text-zinc-400">
              {chapterChoices.map((c, i) => (
                <li
                  key={`${c.choiceId}-${i}`}
                  className="border-l border-zinc-700/60 pl-3"
                >
                  {c.label}
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="pt-4 flex flex-col items-center gap-3">
          {hasNextChapter ? (
            <button
              type="button"
              onClick={onNext}
              className="px-10 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white tracking-widest text-sm transition-colors"
            >
              进入下一章
            </button>
          ) : (
            <button
              type="button"
              onClick={onBackToMenu}
              className="px-10 py-3 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-100 tracking-widest text-sm transition-colors"
            >
              返回主菜单
            </button>
          )}
          <button
            type="button"
            onClick={onBackToMenu}
            className="text-xs text-zinc-600 hover:text-zinc-400 underline-offset-4 hover:underline"
          >
            回到章节列表
          </button>
        </div>
      </div>
    </div>
  );
}
