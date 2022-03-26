import { useCallback } from 'react';
import type { NativeSyntheticEvent, NativeTouchEvent } from 'react-native';
import { useFormikContext } from '@mochi-forms/react';

export function useSubmitButton() {
  const { submitForm } = useFormikContext();
  const handlePress = useCallback(
    (_ev: NativeSyntheticEvent<NativeTouchEvent>) => {
      submitForm();
    },
    [submitForm]
  );
  return { onPress: handlePress };
}
