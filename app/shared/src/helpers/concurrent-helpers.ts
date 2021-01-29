import { selectRange } from './array-helpers';
import { useState, useCallback, useMemo } from 'react';
import { useEffect } from 'react';

/**
 * Check if all elements show the same number.
 * https://github.com/dai-shi/will-this-react-global-state-work-in-concurrent-mode
 */
export const useCheckTearing = (elementCount: number) => {
  const ids = useMemo(() => selectRange(elementCount), [elementCount]);
  const checkMatches = useCallback(() => {
    const [first, ...rest] = ids;
    const firstValue = Number(
      document.querySelector(`.state:nth-of-type(${first})`)?.innerHTML
    );
    console.log(rest, firstValue);
    return rest.every(
      id =>
        Number(
          document.querySelector(`.state:nth-of-type(${id})`)?.innerHTML
        ) === firstValue
    );
  }, [ids]);
  const [isMatching, setIsMatching] = useState(true);

  // We won't create an infinite loop switching between booleans, I promise.
  // (famous last words)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isMatching && !checkMatches()) {
      setIsMatching(false);
    }
  });

  return isMatching;
};
