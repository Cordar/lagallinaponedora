import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

type Return<T> = [T, Dispatch<SetStateAction<T>>];

export default function useAutoResetState<T>(initialValue: T, durationInMs: number) {
  const [internalState, setInternalState] = useState<T>(initialValue);

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    if (internalState !== initialValue) timeout = setTimeout(() => setInternalState(initialValue), durationInMs);

    return () => {
      timeout && clearTimeout(timeout);
    };
  }, [durationInMs, initialValue, internalState]);

  return [internalState, setInternalState] as Return<T>;
}
