import type { LifeStage } from '../types/game';

export function getLifeStage(age: number): LifeStage {
  if (age < 20) return 'postExam';
  if (age <= 24) return 'college';
  if (age <= 34) return 'career';
  return 'family';
}

export function lifeStageLabel(stage: LifeStage): string {
  const m: Record<LifeStage, string> = {
    postExam: '高考后过渡',
    college: '大学阶段',
    career: '职场阶段',
    family: '家庭阶段',
  };
  return m[stage];
}
