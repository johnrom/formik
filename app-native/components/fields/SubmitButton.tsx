import * as React from 'react';
import { useFormikContext } from 'formik';
import { Button } from 'react-native';

export const SubmitButton = () => {
    const { submitForm } = useFormikContext();
    return <Button onPress={() => submitForm()} title="Submit" />
}