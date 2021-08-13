import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Field, Formik } from 'formik';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { NativeTextField } from '../components/fields/NativeTextField';
import { SubmitButton } from '../components/fields/SubmitButton';

export default function TabOneScreen() {
  return (
    <View style={styles.container}>
      <Formik initialValues={{ hello: 'sup' }} onSubmit={(values) => console.log(values)}>
        <>
          <Field as={NativeTextField} name="hello" />
          <SubmitButton />
        </>
      </Formik>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
