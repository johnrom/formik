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

const Input = (p: FieldConfig<string>) => {
  useField(p);
  useAutoUpdate();
  const api = useFormikApi();
  const state = useFullFormikState(api);

  return (
    <div className="state" id={p.name}>
      <pre>
        <code>{JSON.stringify(state, null, 2)}</code>
      </pre>
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
  console.log(JSON.stringify(values, null, 2));
};

const [parentId, lastId, ...inputs] = array;

const kids = inputs.map(id => (
  <Input key={`input-${id}`} name={`input-${id}`} validate={isRequired} />
));

export function TearingPage() {
  const formik = useFormik({ onSubmit, initialValues });
  // in useContextSelector, this returns the unsafeState
  // because there is no context access. in other versions,
  // this returns a safely subscribed version of state.
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

  // skip form-level state to check inputs
  const didInputsTear = useCheckTearing(array.length - 1, 1);

  // check form-level against inputs
  const didFormStateTearWithInputs = useCheckTearing(array.length);

  return (
    <div className="tearing-page">
      <div>
        <style jsx global>
          {`
            .state-container {
              display: flex;
              max-height: 500px;
              overflow-x: hidden;
              align-items: flex-start;
            }
            .state {
              width: 20%;
            }
            .middle {
              position: relative;
              display: flex;
              width: 60%;
              overflow: auto;
            }
            .middle .state {
              min-width: 33.333%;
            }
          `}
        </style>
        <h1>Formik Tearing Tests</h1>
        <h2>Transitioning? {isPending ? 'Yes' : 'No'}</h2>
        <h3>
          Did inputs tear amongst themselves? {didInputsTear ? 'Yes' : 'No'}
        </h3>
        <h3>
          Did form-level state tear with inputs?{' '}
          {didFormStateTearWithInputs ? 'Yes' : 'No'}
        </h3>
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
      <FormikProvider value={formik}>
        <Form>
          <div className="state-container">
            <div className="state" id={`input-${parentId.toString()}`}>
              <pre>
                <code>{JSON.stringify(fullState, null, 2)}</code>
              </pre>
            </div>
            <div className="middle">{kids}</div>
            <div className="state" id={`input-${lastId.toString()}`}>
              <pre>
                <code>{JSON.stringify(fullState, null, 2)}</code>
              </pre>
            </div>
          </div>
          <button type="submit">Submit</button>
        </Form>
      </FormikProvider>
    </div>
  );
}
