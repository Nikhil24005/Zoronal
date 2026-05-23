import { useState } from 'react';

function StarRating({ value, onChange, size = 'md' }) {
  const isInteractive = typeof onChange === 'function';
  const safeValue = clampRating(value);
  const [hoverValue, setHoverValue] = useState(0);
  const sizeClass = getSizeClass(size);

  const StarElement = isInteractive ? 'button' : 'span';
  const displayValue = isInteractive && hoverValue > 0 ? hoverValue : safeValue;

  return (
    <div className={`inline-flex items-center gap-1 ${isInteractive ? 'select-none' : ''}`}>
      {Array.from({ length: 5 }, (_, index) => index + 1).map((starValue) => {
        const isFilled = starValue <= displayValue;

        return (
          <StarElement
            key={starValue}
            type={isInteractive ? 'button' : undefined}
            onClick={isInteractive ? () => onChange(starValue) : undefined}
            onMouseEnter={isInteractive ? () => setHoverValue(starValue) : undefined}
            onMouseLeave={isInteractive ? () => setHoverValue(0) : undefined}
            className={[
              'inline-flex items-center justify-center transition-colors duration-150',
              sizeClass,
              isInteractive
                ? 'cursor-pointer rounded-full focus:outline-none focus:ring-4 focus:ring-amber-200 hover:scale-105'
                : 'cursor-default',
              isFilled
                ? 'text-amber-400 hover:text-amber-500'
                : 'text-slate-300 hover:text-slate-400',
            ].join(' ')}
            aria-label={isInteractive ? `Rate ${starValue} star${starValue > 1 ? 's' : ''}` : undefined}
            aria-pressed={isInteractive ? safeValue === starValue : undefined}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="h-full w-full" aria-hidden="true">
              <path d="M9.999 1.25l2.425 4.915 5.426.788-3.925 3.825.926 5.402-4.852-2.55-4.852 2.55.926-5.402L1.149 6.953l5.426-.788L9.999 1.25z" />
            </svg>
          </StarElement>
        );
      })}
    </div>
  );
}

function clampRating(value) {
  const numericValue = Number(value || 0);

  if (Number.isNaN(numericValue)) {
    return 0;
  }

  return Math.min(5, Math.max(0, numericValue));
}

function getSizeClass(size) {
  if (size === 'sm') {
    return 'h-4 w-4';
  }

  if (size === 'lg') {
    return 'h-7 w-7';
  }

  return 'h-5 w-5';
}

export default StarRating;
