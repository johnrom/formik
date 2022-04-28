import * as React from 'react';
import { Button } from 'react-native';
import { useSubmitButton } from '@mochi-forms/react-native';

interface SubmitButtonProps {
  title?: string;
}

export const SubmitButton: React.FunctionComponent<SubmitButtonProps> = ({
  title = 'Submit',
}) => {
  const { onPress } = useSubmitButton();

  return <Button title={title} onPress={onPress} />;
};
