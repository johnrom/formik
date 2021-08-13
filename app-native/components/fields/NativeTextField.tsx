import * as React from 'react';
import { FieldInputProps } from 'formik';
import { TextInput } from 'react-native';

export const NativeTextField = (props: FieldInputProps<string>) => {
    return <TextInput onChangeText={props.onChange} onBlur={props.onBlur(props.name)} value={props.value} />
}
