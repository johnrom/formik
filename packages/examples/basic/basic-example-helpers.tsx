export interface ExampleFormValues {
  firstName: string;
  lastName: string;
  email: string;
}

export const exampleInitialValues: ExampleFormValues = {
  firstName: '',
  lastName: '',
  email: '',
};

export const exampleAlertOnSubmit = async (values: ExampleFormValues) => {
  alert(JSON.stringify(values, null, 2));
};
