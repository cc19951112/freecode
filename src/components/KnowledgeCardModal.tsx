import type { KnowledgeCard } from '../types/game';
import { BookOpen, ExternalLink, X } from 'lucide-react';

type Props = {
  card: KnowledgeCard;
  onClose: () => void;
};

export function KnowledgeCardModal({ card, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="知识卡片"
    >
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-700 rounded-3xl shadow-2xl p-6 relative max-h-[85vh] overflow-y-auto">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 p-2 rounded-full text-zinc-500 hover:text-white hover:bg-zinc-800"
          aria-label="关闭"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium mb-2">
          <BookOpen className="w-4 h-4" />
          知识卡片
        </div>
        <h2 className="text-xl font-semibold text-white pr-8 mb-3">{card.title}</h2>
        <p className="text-sm text-zinc-300 leading-relaxed mb-4">{card.text}</p>
        {card.sourceLabel && card.sourceUrl && (
          <a
            href={card.sourceUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            {card.sourceLabel}
          </a>
        )}
        <p className="text-[10px] text-zinc-500 mt-4">
          外链仅供泛读。医学决策请以执业医生与本地指南为准。
        </p>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500"
          >
            知道了
          </button>
        </div>
      </div>
    </div>
  );
}
