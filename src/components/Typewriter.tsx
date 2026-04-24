import { useEffect, useRef, useState } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;          // ms / 字
  enabled?: boolean;       // 关闭时直接显示完整 text
  forceComplete?: boolean; // 父组件请求立即完成
  onDone?: () => void;
  className?: string;
}

export function Typewriter({
  text,
  speed = 28,
  enabled = true,
  forceComplete = false,
  onDone,
  className,
}: TypewriterProps) {
  const [shown, setShown] = useState(enabled ? '' : text);
  const timerRef = useRef<number | null>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    if (!enabled) {
      setShown(text);
      onDoneRef.current?.();
      return;
    }
    setShown('');
    let i = 0;
    // 长文本自动加速
    const effectiveSpeed = text.length > 300 ? Math.max(8, speed * 0.66) : speed;
    const tick = () => {
      i += 1;
      setShown(text.slice(0, i));
      if (i >= text.length) {
        timerRef.current = null;
        onDoneRef.current?.();
        return;
      }
      timerRef.current = window.setTimeout(tick, effectiveSpeed);
    };
    timerRef.current = window.setTimeout(tick, effectiveSpeed);
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [text, speed, enabled]);

  useEffect(() => {
    if (forceComplete && shown !== text) {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setShown(text);
      onDoneRef.current?.();
    }
  }, [forceComplete, shown, text]);

  return <span className={className}>{shown}</span>;
}
