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

export const exampleOnSubmit = async (values: ExampleFormValues) => {
  alert(JSON.stringify(values, null, 2));
};

export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
