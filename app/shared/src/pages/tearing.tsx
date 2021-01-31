import * as React from 'react';
import {
  // eslint-disable-next-line
  // @ts-ignore
  unstable_useTransition as useTransition,
} from 'react';
import {
  FieldConfig,
  Form,
  FormikProvider,
  useField,
  useFormik,
  useFormikApi,
  useFullFormikState,
} from 'formik';
import { selectRandomArrayItem, selectRange } from '../helpers/array-helpers';
import { useCheckTearing } from '../helpers/tearing-helpers';
import {
  DynamicValues,
  useAutoUpdate,
  useChaosHelpers,
} from '../helpers/chaos-helpers';
import { useFormikComputedStateInternal } from 'packages/@formik/react-subscriptions/src/hooks/useFormikComputedState';

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
  const [unsafeState, formik] = useFormik({ onSubmit, initialValues });
  const unsafeFullState = {
    ...unsafeState,
    ...useFormikComputedStateInternal(formik, unsafeState),
  };
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

  // fullState isn't accessible with useContextSelector
  // because there is no Context at this level,
  // so we only check the inputs
  const didTear = useCheckTearing(array.length, fullState ? 0 : 1);

  // lets check the unsafe state returned from useFormik
  // this doesn't work from useContextSelector, which sucks because
  // it's the most important test for useContextSelector
  const didRawStateTear = useCheckTearing(array.length + 1, fullState ? 0 : 1);

  // useContextSelector provides the full value to Provider
  const providerValue = fullState ? formik : { ...formik, ...unsafeState };

  return (
    <div>
      <div>
        <h1>Formik Tearing Tests: {didTear ? 'TORE' : 'No Tearing Yet.'}</h1>
        <h2>Transitioning? {isPending ? 'Yes' : 'No'}</h2>
        <h3>
          Did state returned from useFormik tear?{' '}
          {didRawStateTear ? 'Yes' : 'No'}
        </h3>
        <p>
          <small>
            The second tear check doesn't work for useContextSelector.
          </small>
        </p>
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
      <FormikProvider value={providerValue}>
        <Form>
          <div className="state" id={parentId.toString()}>
            {JSON.stringify(fullState)}
          </div>
          {kids}
          <div className="state unsafe" id={parentId.toString()}>
            {JSON.stringify(unsafeFullState)}
          </div>
          <button type="submit">Submit</button>
        </Form>
      </FormikProvider>
    </div>
  );
}
