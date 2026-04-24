import { useEffect, useRef, useState } from 'react';
import {
  selectAllRuntimeBeats,
  selectCurrentChapter,
  selectCurrentScene,
  selectVisibleBeats,
  useNovelStore,
} from '../stores/useNovelStore';
import { ALL_CHAPTERS } from '../data/chapters';
import { BeatLine } from './BeatLine';
import { ChoicePanel } from './ChoicePanel';
import { StatusDrawer } from './StatusDrawer';

export function ReaderView() {
  const state = useNovelStore((s) => s.state);
  const advance = useNovelStore((s) => s.advance);
  const applyChoice = useNovelStore((s) => s.applyChoice);
  const backToMenu = useNovelStore((s) => s.backToMenu);

  const chapter = selectCurrentChapter(state);
  const scene = selectCurrentScene(state);
  const visibleBeats = selectVisibleBeats(state);
  const allBeats = selectAllRuntimeBeats(state);

  const totalChapters = ALL_CHAPTERS.length;
  const progress = chapter ? Math.round((chapter.index / totalChapters) * 100) : 0;

  // 当前 beat 是否已播放完成 (打字机) -> 控制提示与点击行为
  const [currentDone, setCurrentDone] = useState(false);
  const [forceComplete, setForceComplete] = useState(false);
  const lastBeatKeyRef = useRef<string>('');

  const currentBeatKey = `${state.chapterId}|${state.sceneId}|${state.beatIndex}|${
    state.runtimeBeats ? 'rt' : 'sc'
  }`;

  // 切到新 beat -> 重置 done/force
  useEffect(() => {
    if (lastBeatKeyRef.current !== currentBeatKey) {
      lastBeatKeyRef.current = currentBeatKey;
      setCurrentDone(!state.prefs.typewriter); // 关闭动画时直接算完成
      setForceComplete(false);
    }
  }, [currentBeatKey, state.prefs.typewriter]);

  // 滚到底部
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = scrollerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visibleBeats.length, state.phase]);

  const handleAdvanceClick = () => {
    if (state.phase !== 'reading') return;
    if (!currentDone) {
      setForceComplete(true);
      return;
    }
    advance();
  };

  // 键盘: 空格/回车 推进
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (state.phase !== 'reading') return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleAdvanceClick();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!chapter || !scene) {
    return (
      <div className="min-h-dvh flex items-center justify-center text-zinc-500">
        加载中……
      </div>
    );
  }

  const isReading = state.phase === 'reading';
  const isChoosing = state.phase === 'choosing';
  const reachedSceneEnd = state.beatIndex >= allBeats.length - 1;

  return (
    <div className="min-h-dvh w-full bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800/60 px-5 py-3 flex items-center justify-between gap-4 sticky top-0 bg-zinc-950/95 backdrop-blur z-10">
        <div className="min-w-0 flex items-center gap-3">
          <div className="text-[11px] text-zinc-500 tracking-widest shrink-0">
            CH {String(chapter.index).padStart(2, '0')}
          </div>
          <div className="text-sm text-zinc-200 truncate">{chapter.title}</div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block w-32 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-[11px] text-zinc-500 tabular-nums">
            {chapter.index} / {totalChapters}
          </div>
          <button
            type="button"
            onClick={backToMenu}
            className="text-[11px] text-zinc-500 hover:text-zinc-300 underline-offset-2 hover:underline"
          >
            主菜单
          </button>
        </div>
      </header>

      <div className="max-w-[1100px] mx-auto px-5 py-6 lg:flex lg:gap-8 lg:items-start">
        <main
          className="flex-1 min-w-0 max-w-[720px] mx-auto lg:mx-0"
        >
          <div
            ref={scrollerRef}
            className="space-y-5 font-serif text-[16px] sm:text-[17px]"
            onClick={() => {
              if (isReading) handleAdvanceClick();
            }}
            role={isReading ? 'button' : undefined}
            tabIndex={isReading ? 0 : -1}
          >
            {visibleBeats.map((beat, idx) => {
              const isCurrent = idx === visibleBeats.length - 1;
              return (
                <BeatLine
                  key={beat.id}
                  beat={beat}
                  isCurrent={isCurrent && isReading}
                  typewriterEnabled={state.prefs.typewriter}
                  typewriterSpeed={state.prefs.typewriterSpeed}
                  forceComplete={isCurrent && forceComplete}
                  onDone={isCurrent ? () => setCurrentDone(true) : undefined}
                />
              );
            })}
          </div>

          {isReading && (
            <div className="mt-6 flex items-center justify-center gap-3 text-xs text-zinc-500">
              {!currentDone ? (
                <span className="opacity-80">点击或按空格 跳过本段动画</span>
              ) : reachedSceneEnd && scene.choice ? (
                <span className="opacity-80">点击或按空格 进入选择</span>
              ) : (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdvanceClick();
                  }}
                  className="px-4 py-1.5 rounded-full border border-zinc-700 hover:border-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  继续
                </button>
              )}
            </div>
          )}

          {isChoosing && scene.choice && (
            <ChoicePanel
              prompt={scene.choice.prompt}
              options={scene.choice.options}
              showHints={state.prefs.showHints}
              onChoose={(id) => {
                applyChoice(id);
              }}
            />
          )}
        </main>

        <div className="mt-10 lg:mt-0">
          <StatusDrawer effects={state.effects} />
        </div>
      </div>

    </div>
  );
}
