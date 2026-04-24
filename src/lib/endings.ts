import type { EndingResult, GameState, GameMode } from '../types/game';

export function isForcedBadEnd(s: GameState): boolean {
  return s.uricAcid > 90 || s.health < 20;
}

/** 第 61 月及以后触发的长局收官（与 month>60 检查配合） */
export function resolveFiveYearEnding(s: GameState, mode: GameMode): EndingResult {
  if (s.uricAcid > 90 || s.health < 20) {
    return { text: '并发症风险陡增，生活与健康严重失序。', tag: '健康危机型' };
  }
  if (s.uricAcid < 40 && s.health > 80 && s.knowledge >= 70) {
    return { text: '你长期把指数与知识都维持在高位，形成可持续节奏。', tag: '医学控制型' };
  }
  if (s.stress > 78 && s.money < 2000) {
    return { text: '经济压力与焦虑长期偏高，管理难度越来越大。', tag: '社畜失衡型' };
  }
  if (s.knowledge >= 85 && s.relationships >= 60) {
    return { text: '你既保持学习也兼顾关系支持，在亲友间成为可信赖的提醒者。', tag: '教育科普型' };
  }
  if (s.uricAcid < 55 && s.health > 65) {
    return { text: '五年过去，你总体仍在正轨上，可继续把习惯打磨得更细。', tag: '马拉松型' };
  }
  if (mode === 'casual') {
    return { text: '休闲模式五年收官：有起伏，但已尽力而为。', tag: '休闲收束型' };
  }
  return { text: '五年过去，指数仍有波动。别灰心，调整节奏可以再来一局。', tag: '持续战斗型' };
}

export function resolveEarlyExcellence(s: GameState): EndingResult | null {
  // 注：age 在「第 60 个月末」为 24 岁，若用 >=25 会与「>60 月五年收官」互斥
  if (s.age >= 24 && s.uricAcid < 45 && s.health > 75) {
    return { text: '良好控制。你在较年轻阶段就把「尿酸相关指数」维持在舒适区。', tag: '稳态平衡型' };
  }
  if (s.month >= 32 && s.knowledge >= 86 && s.relationships >= 62) {
    return { text: '知识与人际双双在线，你走出了「能玩懂、能分享」的路。', tag: '教育科普型' };
  }
  if (s.month >= 30 && s.uricAcid < 48 && s.health > 78 && s.knowledge >= 72) {
    return { text: '你长期保持复查与自学的组合拳，把指数压在稳定带。', tag: '医学控制型' };
  }
  if (s.month >= 40 && s.stress > 82 && s.money < 1800) {
    return { text: '长期高压与吃紧的现金流叠加，让维持习惯变得很难。', tag: '社畜失衡型' };
  }
  return null;
}
