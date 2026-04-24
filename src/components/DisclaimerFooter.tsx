const DISCLAIMER =
  '本游戏为健康主题的娱乐与科普向模拟。界面中的「尿酸相关指数」等为 0–100 的游戏化指标，不对应你真实的血检数值，也不能替代医疗诊断、处方或随诊。如有不适，请咨询正规医疗机构。';

export function DisclaimerFooter({ className = '' }: { className?: string }) {
  return (
    <p
      className={`text-left text-xs leading-relaxed text-zinc-500 border border-zinc-800/80 rounded-2xl p-4 bg-zinc-900/50 ${className}`}
    >
      {DISCLAIMER}
    </p>
  );
}

export const disclaimerShort = '本游戏为娱乐与科普，指标为游戏化设计，不替代医疗。';
