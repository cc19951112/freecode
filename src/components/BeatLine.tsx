import type { Beat } from '../types/novel';
import { Typewriter } from './Typewriter';

interface BeatLineProps {
  beat: Beat;
  isCurrent: boolean;          // 是否是当前正在播放的 beat
  typewriterEnabled: boolean;
  typewriterSpeed: number;
  forceComplete?: boolean;     // 当前 beat 被点击跳完
  onDone?: () => void;
}

const ROLE_WRAPPER: Record<Beat['role'], string> = {
  narration: 'text-zinc-200',
  self: 'text-sky-200/90 italic pl-4 border-l border-sky-500/20',
  other: 'text-zinc-100',
  system: 'text-zinc-500 text-center text-[15px] tracking-wide',
};

export function BeatLine({
  beat,
  isCurrent,
  typewriterEnabled,
  typewriterSpeed,
  forceComplete,
  onDone,
}: BeatLineProps) {
  const wrapperClass = ROLE_WRAPPER[beat.role];

  if (beat.role === 'other') {
    return (
      <div className="space-y-1.5">
        {beat.speaker && (
          <div className="text-xs text-zinc-500 tracking-wide">
            {beat.speaker}
          </div>
        )}
        <div
          className={`${wrapperClass} bg-zinc-900/40 border border-zinc-800/80 rounded-lg px-4 py-3 leading-[1.9]`}
        >
          {isCurrent && typewriterEnabled ? (
            <Typewriter
              text={beat.text}
              speed={typewriterSpeed}
              enabled
              forceComplete={forceComplete}
              onDone={onDone}
            />
          ) : (
            beat.text
          )}
        </div>
      </div>
    );
  }

  if (beat.role === 'system') {
    return (
      <div className={`${wrapperClass} py-1`}>
        {isCurrent && typewriterEnabled ? (
          <Typewriter
            text={beat.text}
            speed={typewriterSpeed}
            enabled
            forceComplete={forceComplete}
            onDone={onDone}
          />
        ) : (
          beat.text
        )}
      </div>
    );
  }

  return (
    <p className={`${wrapperClass} leading-[1.95]`}>
      {isCurrent && typewriterEnabled ? (
        <Typewriter
          text={beat.text}
          speed={typewriterSpeed}
          enabled
          forceComplete={forceComplete}
          onDone={onDone}
        />
      ) : (
        beat.text
      )}
    </p>
  );
}
