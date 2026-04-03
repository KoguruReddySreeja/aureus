import { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';

export default function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 2 }) {
  const [display, setDisplay] = useState('0');
  const prevValue = useRef(0);

  useEffect(() => {
    const from = prevValue.current;
    const to = typeof value === 'number' ? value : 0;
    prevValue.current = to;

    const controls = animate(from, to, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => {
        setDisplay(
          new Intl.NumberFormat('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }).format(v)
        );
      },
    });

    return () => controls.stop();
  }, [value, decimals]);

  return (
    <span className="font-mono tabular-nums">
      {prefix}{display}{suffix}
    </span>
  );
}
