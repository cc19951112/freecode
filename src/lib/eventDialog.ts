import type { EventDialogLine, GameEvent } from '../types/game';

const LABEL: Record<'uricAcid' | 'health' | 'stress' | 'knowledge' | 'relationships' | 'money', string> = {
  uricAcid: '尿酸相关指数',
  health: '健康',
  stress: '压力',
  knowledge: '疾病知识',
  relationships: '人际支持',
  money: '资金',
};

type NumKey = keyof typeof LABEL;

function adjustDeltaForMode(key: NumKey, delta: number, casual: boolean): number {
  if (!casual) return delta;
  if (key === 'uricAcid' && delta > 0) return Math.round(delta * 0.9);
  if (key === 'stress' && delta > 0) return Math.round(delta * 0.9);
  if (key === 'health' && delta < 0) return Math.round(delta * 0.9);
  if (key === 'money' && delta < 0) return Math.round(delta * 0.92);
  return delta;
}

/**
 * 仅根据「本事件」的 effects 写一句人话摘要，供弹窗用（不暴露原始对象）。
 */
export function narrateEventEffects(
  effects: GameEvent['effects'],
  casual: boolean
): string {
  const parts: string[] = [];
  (Object.keys(effects) as NumKey[]).forEach((k) => {
    const v = effects[k];
    if (typeof v !== 'number') return;
    const d = adjustDeltaForMode(k, v, casual);
    if (d === 0) return;
    const name = LABEL[k];
    if (k === 'money') {
      const sign = d > 0 ? '增加' : '减少';
      parts.push(`${name}（叙事）约 ${sign} ¥${Math.abs(d).toLocaleString()}`);
    } else {
      parts.push(
        `${name} ${d > 0 ? '上升' : '变化'}了约 ${Math.abs(d)} 点（游戏内 0–100 抽象）`
      );
    }
  });
  if (!parts.length) return '这段剧情对游戏内指标没有额外加减（或非常微小）。';
  return '因这段随机故事，游戏内出现这样的波动感：' + parts.join('；') + '。';
}

/** 无对话配置时，从标题与描述拆出至少两行可读文本 */
export function buildFallbackEventLines(ev: GameEvent): EventDialogLine[] {
  const desc = (ev.description || '').trim();
  const chunks = desc.split(/[。！？\n]+/).map((s) => s.trim()).filter(Boolean);
  const lines: EventDialogLine[] = [
    { role: 'system', text: `【本月随机故事：${ev.title}】` },
  ];
  if (chunks[0]) lines.push({ role: 'narration', text: chunks[0] + (desc.match(/[。！？]$/) ? '' : '。') });
  if (chunks[1]) {
    lines.push({ role: 'self', text: '……' + chunks[1] + '。' });
  } else if (!chunks[0] && ev.title) {
    lines.push({ role: 'narration', text: '这一月里，有件事悄悄改变了你的节奏。' });
  }
  return lines;
}

export function buildEventDialogLines(ev: GameEvent): EventDialogLine[] {
  if (ev.dialogue && ev.dialogue.length > 0) {
    return ev.dialogue.map((l) => ({ ...l, text: l.text.trim() })).filter((l) => l.text.length > 0);
  }
  return buildFallbackEventLines(ev);
}
