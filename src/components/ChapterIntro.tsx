import type { Chapter } from '../types/novel';

interface ChapterIntroProps {
  chapter: Chapter;
  onStart: () => void;
  onBackToMenu?: () => void;
}

export function ChapterIntro({ chapter, onStart, onBackToMenu }: ChapterIntroProps) {
  const isPlaceholder = chapter.status === 'placeholder';
  return (
    <div className="min-h-dvh w-full flex items-center justify-center px-6 py-10 bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 text-zinc-100">
      <div className="max-w-xl w-full text-center space-y-8">
        <div className="text-[11px] tracking-[0.5em] text-zinc-500">
          CHAPTER {String(chapter.index).padStart(2, '0')}
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-bold leading-snug tracking-wide">
            {chapter.title}
          </h1>
          {chapter.subtitle && (
            <div className="text-sm text-zinc-500 tracking-wider">
              {chapter.subtitle}
            </div>
          )}
        </div>
        {chapter.intro && (
          <p className="text-zinc-300/90 leading-[2] text-[15px] font-serif">
            {chapter.intro}
          </p>
        )}
        <div className="flex flex-col items-center gap-3 pt-4">
          {isPlaceholder ? (
            <>
              <div className="text-xs text-amber-400/80">
                本章正文待写。
              </div>
              <button
                type="button"
                onClick={onStart}
                className="px-8 py-2.5 rounded-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-sm transition-colors"
              >
                我知道了
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onStart}
              className="px-10 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white tracking-widest text-sm transition-colors"
            >
              开始本章
            </button>
          )}
          {onBackToMenu && (
            <button
              type="button"
              onClick={onBackToMenu}
              className="text-xs text-zinc-600 hover:text-zinc-400 underline-offset-4 hover:underline"
            >
              返回主菜单
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
