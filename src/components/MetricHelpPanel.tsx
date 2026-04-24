import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

type Props = {
  className?: string;
};

export function MetricHelpPanel({ className = '' }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`mb-2 border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900/40 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-left text-xs text-zinc-300 hover:bg-zinc-800/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-500 shrink-0" />
          本游戏「指标说明」一页纸
        </span>
        {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
      </button>
      {open && (
        <div className="px-4 pb-4 text-sm text-zinc-400 space-y-2 border-t border-zinc-800/80">
          <p>
            所有 0–100 的条与数字均为<strong className="text-zinc-300">游戏化抽象</strong>，用于在叙事里表达「相对风险 / 控制程度」，并非化验单上
            μmol/L 的换算，也不做个体预测。
          </p>
          <p>
            <span className="text-zinc-300">资金</span> 为游戏内经济压力与资源的简化（人民币，仅作叙事），与医学指标是两套系统。
          </p>
          <p>
            日志中 <span className="text-emerald-500/90">【行动】</span> 表示你当月主选择，<span className="text-amber-500/90">【事件】</span>{' '}
            表示当月随机或条件触发的剧情。
          </p>
        </div>
      )}
    </div>
  );
}
