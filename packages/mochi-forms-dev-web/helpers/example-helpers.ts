export interface BasicPizzaPartyFormValues {
  firstName: string;
  lastName: string;
  numberOfPizzas: number;
}

export const basicPizzaPartyInitialValues: BasicPizzaPartyFormValues = {
  firstName: '',
  lastName: '',
  numberOfPizzas: 1,
};

export const alertOnSubmit = async (values: any) => {
  alert(JSON.stringify(values, null, 2));
};

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
