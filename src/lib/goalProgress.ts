import type { GameState, PlayerGoal } from '../types/game';

/** 课题完成度（简版 %，供 UI 进度条） */
export function getGoalCompletionPercent(g: PlayerGoal, p: GameState['goalProgress']): number {
  switch (g) {
    case 'uric':
      return Math.min(100, Math.round((p.monthsUnderUric50 / 6) * 100));
    case 'balance':
      return Math.min(100, Math.round((p.monthsBalanced / 8) * 100));
    case 'knowledge':
      return Math.min(100, Math.round((p.monthsHighKnowledge / 3) * 100));
    case 'relationship':
      return Math.min(100, Math.round((p.monthsHighRelationship / 3) * 100));
  }
}
