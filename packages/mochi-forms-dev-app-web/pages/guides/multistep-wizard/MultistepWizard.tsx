import * as React from 'react';
import {
  ErrorMessage,
  LegacyField,
  Form,
  Formik,
  FormikBag,
  FormikConfig,
  FormikHelpers,
} from '@mochi-forms/react';
import * as Yup from 'yup';
import { Debug } from '../helpers/Debug';
import { sleep } from '../helpers';

export interface WizardProps<Values> {
  children: React.ReactNode | React.ReactNode[];
  initialValues: Values;
  onSubmit: FormikConfig<Values>['onSubmit'];
}

const getStepIsFormik =
  <Values,>() =>
  (
    step: React.ReactNode
  ): step is React.ReactElement<WizardStepProps<Values>> => {
    return typeof step === 'object' && (step as any).type === WizardStep;
  };

// Wizard is a single Formik instance whose children are each page of the
// multi-step form. The form is submitted on each forward transition (can only
// progress with valid input), whereas a backwards step is allowed with
// incomplete data. A snapshot of form state is used as initialValues after each
// transition. Each page has an optional submit handler, and the top-level
// submit is called when the final page is submitted.
const Wizard = <Values,>({
  children,
  initialValues,
  onSubmit,
}: WizardProps<Values>) => {
  const [stepNumber, setStepNumber] = React.useState(0);
  const steps = React.Children.toArray(children).filter(
    getStepIsFormik<Values>()
  );
  const [snapshot, setSnapshot] = React.useState(initialValues);

  const step = steps[stepNumber];
  const totalSteps = steps.length;
  const isLastStep = stepNumber === totalSteps - 1;

  const next = (values: Values) => {
    setSnapshot(values);
    setStepNumber(Math.min(stepNumber + 1, totalSteps - 1));
  };

  const previous = (values: Values) => {
    setSnapshot(values);
    setStepNumber(Math.max(stepNumber - 1, 0));
  };

  const handleSubmit = async (values: Values, bag: FormikHelpers<Values>) => {
    if (step.props.onSubmit) {
      await step.props.onSubmit(values, bag);
    }
    if (isLastStep) {
      return onSubmit(values, bag);
    } else {
      bag.setTouched({});
      next(values);
    }
  };

  return (
    <Formik
      initialValues={snapshot}
      onSubmit={handleSubmit}
      validationSchema={step.props.validationSchema}
    >
      {formik => (
        <Form>
          <p>
            Step {stepNumber + 1} of {totalSteps}
          </p>
          {step}
          <div style={{ display: 'flex' }}>
            {stepNumber > 0 && (
              <button onClick={() => previous(formik.values)} type="button">
                Back
              </button>
            )}
            <div>
              <button disabled={formik.isSubmitting} type="submit">
                {isLastStep ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
          <Debug />
        </Form>
      )}
    </Formik>
  );
};

export type WizardStepProps<Values> = Pick<
  FormikConfig<Values>,
  'onSubmit' | 'validationSchema' | 'children'
>;

const WizardStep = <Values,>({ children }: WizardStepProps<Values>) => (
  <>{children}</>
);

const MultistepWizardExample = () => (
  <div>
    <h1>Formik Multistep Wizard</h1>
    <Wizard
      initialValues={{
        email: '',
        firstName: '',
        lastName: '',
      }}
      onSubmit={async values =>
        sleep(300).then(() => console.log('Wizard submit', values))
      }
    >
      <WizardStep
        onSubmit={() => console.log('Step1 onSubmit')}
        validationSchema={Yup.object({
          firstName: Yup.string().required('required'),
          lastName: Yup.string().required('required'),
        })}
      >
        <div>
          <label htmlFor="firstName">First Name</label>
          <LegacyField
            autoComplete="given-name"
            component="input"
            id="firstName"
            name="firstName"
            placeholder="First Name"
            type="text"
          />
          <ErrorMessage className="error" component="div" name="firstName" />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <LegacyField
            autoComplete="family-name"
            component="input"
            id="lastName"
            name="lastName"
            placeholder="Last Name"
            type="text"
          />
          <ErrorMessage className="error" component="div" name="lastName" />
        </div>
      </WizardStep>
      <WizardStep
        onSubmit={() => console.log('Step2 onSubmit')}
        validationSchema={Yup.object({
          email: Yup.string()
            .email('Invalid email address')
            .required('required'),
        })}
      >
        <div>
          <label htmlFor="email">Email</label>
          <LegacyField
            autoComplete="email"
            component="input"
            id="email"
            name="email"
            placeholder="Email"
            type="text"
          />
          <ErrorMessage className="error" component="div" name="email" />
        </div>
      </WizardStep>
    </Wizard>
  </div>
);

export default MultistepWizardExample;
