import type { Choice } from '../types/novel';

interface ChoicePanelProps {
  prompt?: string;
  options: Choice[];
  showHints: boolean;
  onChoose: (id: string) => void;
}

export function ChoicePanel({ prompt, options, showHints, onChoose }: ChoicePanelProps) {
  return (
    <div className="mt-8 space-y-3">
      {prompt && (
        <div className="text-sm text-zinc-400 tracking-wide">
          {prompt}
        </div>
      )}
      <div className="grid grid-cols-1 gap-2.5">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChoose(opt.id)}
            className="group text-left bg-zinc-900/70 hover:bg-zinc-800/80 border border-zinc-800 hover:border-emerald-500/50 rounded-xl px-4 py-3 transition-all"
          >
            <div className="text-zinc-100 leading-relaxed">{opt.label}</div>
            {showHints && opt.hint && (
              <div className="mt-1.5 text-[11px] text-zinc-500 group-hover:text-zinc-400 tracking-wide">
                {opt.hint}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
