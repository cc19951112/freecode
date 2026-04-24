import { useEffect, useLayoutEffect } from 'react';
import {
  NOVEL_STORAGE_KEY,
  selectCurrentChapter,
  useNovelStore,
} from './stores/useNovelStore';
import { getNextChapter } from './data/chapters';
import { StartScreen } from './components/StartScreen';
import { ChapterIntro } from './components/ChapterIntro';
import { ChapterOutro } from './components/ChapterOutro';
import { ReaderView } from './components/ReaderView';

function App() {
  const state = useNovelStore((s) => s.state);
  const rehydrate = useNovelStore((s) => s.rehydrate);
  const dismissIntro = useNovelStore((s) => s.dismissIntro);
  const finishChapter = useNovelStore((s) => s.finishChapter);
  const backToMenu = useNovelStore((s) => s.backToMenu);

  useLayoutEffect(() => {
    rehydrate();
  }, [rehydrate]);

  useEffect(() => {
    try {
      window.localStorage.setItem(NOVEL_STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  if (state.phase === 'menu') {
    return <StartScreen />;
  }

  const chapter = selectCurrentChapter(state);
  if (!chapter) {
    return <StartScreen />;
  }

  if (state.phase === 'intro') {
    return (
      <ChapterIntro
        chapter={chapter}
        onStart={() => {
          if (chapter.status === 'placeholder') {
            backToMenu();
          } else {
            dismissIntro();
          }
        }}
        onBackToMenu={backToMenu}
      />
    );
  }

  if (state.phase === 'outro') {
    const next = getNextChapter(chapter.id);
    return (
      <ChapterOutro
        chapter={chapter}
        effects={state.effects}
        history={state.history}
        hasNextChapter={!!next}
        onNext={finishChapter}
        onBackToMenu={() => {
          // 把当前章节加入 unlocked,然后回主菜单
          finishChapter();
          backToMenu();
        }}
      />
    );
  }

  // reading / choosing
  return <ReaderView />;
}

export default App;
