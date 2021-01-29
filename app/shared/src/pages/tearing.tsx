import * as React from 'react';
import {
  // eslint-disable-next-line
  // @ts-ignore
  unstable_useTransition as useTransition,
} from 'react';
import {
  FieldConfig,
  Form,
  Formik,
  useField,
  useFormik,
  useFormikApi,
  useFullFormikState,
} from 'formik';
import { selectRandomArrayItem, selectRange } from '../helpers/array-helpers';
import { useCheckTearing } from '../helpers/concurrent-helpers';
import {
  DynamicValues,
  useAutoUpdate,
  useChaosHelpers,
} from '../helpers/chaos-helpers';

const Input = (p: FieldConfig<string>) => {
  useField(p);
  useAutoUpdate();
  const api = useFormikApi();
  const state = useFullFormikState(api);
  return (
    <div className="state" id={p.name}>
      {JSON.stringify(state)}
    </div>
  );
};

const isRequired = (v: string) => {
  return v && v.trim() !== '' ? undefined : 'Required';
};

const array = selectRange(50);
const initialValues = array.reduce<Record<string, string>>((prev, id) => {
  prev[`Input ${id}`] = '';
  return prev;
}, {});

const onSubmit = async (values: DynamicValues) => {
  await new Promise(r => setTimeout(r, 500));
  alert(JSON.stringify(values, null, 2));
};

const [parentId, ...inputs] = array;

const kids = inputs.map(id => (
  <Input key={`input-${id}`} name={`Input ${id}`} validate={isRequired} />
));

export function TearingPage() {
  const didTear = useCheckTearing(array.length);

  const formik = useFormik({ onSubmit, initialValues });
  const fullState = useFullFormikState(formik);
  const chaosHelpers = useChaosHelpers(formik, array);

  const [startTransition, isPending] = useTransition();

  const handleClickWithoutTransition = React.useCallback(() => {
    selectRandomArrayItem(chaosHelpers)();
  }, [chaosHelpers]);

  const handleClickWithTransition = React.useCallback(() => {
    startTransition(() => {
      selectRandomArrayItem(chaosHelpers)();
    });
  }, [chaosHelpers]);

  return (
    <div>
      <div>
        <h1>Formik Tearing Tests: {didTear ? 'TORE' : 'No Tearing Yet.'}</h1>
        <h2>Transitioning? {isPending ? 'Yes' : 'No'}</h2>
        <button
          type="button"
          id="update-without-transition"
          onClick={handleClickWithoutTransition}
        >
          Update Formik without useTransition
        </button>
        <button
          type="button"
          id="update-with-transition"
          onClick={handleClickWithTransition}
        >
          Update Formik with Transition
        </button>
      </div>
      <Formik onSubmit={onSubmit} initialValues={initialValues}>
        <Form>
          <div className="state" id={parentId.toString()}>
            {JSON.stringify(fullState)}
          </div>
          {kids}
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}
