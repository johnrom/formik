import {
  CustomField,
  LegacyField,
  FieldAsProps,
  FieldComponentClass,
  FieldComponentProps,
  FieldConfig,
  FieldRenderFunction,
  FieldRenderProps,
  Form,
  Formik,
  FormikProvider,
  TypedAsField,
  TypedComponentField,
  useCustomField,
  useFormik,
  useTypedField,
} from '@mochi-forms/react';
import * as React from 'react';

type BasePerson = {
  name: {
    first: string;
    last: string;
  };
  motto: string;
  nicknames: string[];
  age: number;
  ageOrEmpty: number | '';
  favoriteNumbers: number[];
};

type Person = BasePerson & {
  partner: BasePerson;
  friends: BasePerson[];
};

const basePerson: BasePerson = {
  name: {
    first: '',
    last: '',
  },
  motto: '',
  nicknames: [],
  age: 1,
  ageOrEmpty: '',
  favoriteNumbers: [],
};

const person: Person = {
  ...basePerson,
  partner: basePerson,
  friends: [],
};

const proplessFC = () => null;
const propsAnyFC = (props: any) => null;
const partialPropsFC = (props: { name: string }) => null;
const asAnyFC = (props: FieldAsProps<any, any>) => null;
const asNumberFC: TypedAsField<number> = props => null;
const asStringFC: TypedAsField<string> = props => null;
const componentAnyFC = (props: FieldComponentProps<any, any>) => null;
const componentNumberFC: TypedComponentField<number> = props => null;
const renderAnyFn: FieldRenderFunction<any, any> = props => null;
const renderNumberFN = <Value, Values>(
  props: FieldRenderProps<Value, Values>
) => null;

class PropsAnyClass extends React.Component<any> {
  render() {
    return null;
  }
}
class PartialPropsClass extends React.Component<{ name: string }> {
  render() {
    return null;
  }
}
class AsNumberClass<Values> extends React.Component<
  FieldAsProps<number, Values>
> {
  render() {
    return null;
  }
}
class ComponentNumberClass extends FieldComponentClass<number> {
  render() {
    return null;
  }
}

const CustomNumberFC: CustomField<number> = <Values extends any>(
  props: FieldConfig<number, Values>
) => {
  const InnerTypedField = useTypedField<Values>();

  return (
    <>
      <InnerTypedField name={props.name} format={value => {}} />
      <InnerTypedField name={props.name} as={asNumberFC} />
      <InnerTypedField name={props.name} as={asAnyFC} />
      <InnerTypedField
        name={props.name}
        /** @ts-expect-error value must match `number` */
        as={asStringFC}
      />
    </>
  );
};

const noopVoid = () => {};

const FormTests = () => {
  const formikTyped = useFormik<Person>({
    initialValues: person,
    onSubmit: noopVoid,
  });
  const formikAny = useFormik<any>({
    initialValues: person,
    onSubmit: noopVoid,
  });

  React.useEffect(() => {
    formikAny.setFieldValue('age', 1);
    formikAny.setFieldValue('age', '');
    formikTyped.setFieldValue('age', 1);
    formikTyped.setFieldValue('ageOrEmpty', 1);
    formikTyped.setFieldValue('age', 1 as number | '');
    formikTyped.setFieldValue('favoriteNumbers.0', 1);

    // @ts-expect-error value should match
    formikTyped.setFieldValue('age', '');
    // @ts-expect-error string is not assignable to PathOf<Person>
    formikTyped.setFieldValue('age' as string, '' as any);

    // not working due to:
    // https://github.com/microsoft/TypeScript/issues/30808
    // @ts-expect-error
    formikTyped.setFieldValue('ageOrEmpty', '');
    // but this works
    formikTyped.setFieldValue<''>('ageOrEmpty', '');
  }, []);

  return (
    <FormikProvider value={formikTyped}>
      <Form></Form>
    </FormikProvider>
  );
};

const FieldTests = (props: FieldConfig<number, Person>) => {
  const TypedField = useTypedField<Person>();
  const TypedNumberFC = useCustomField<Person>()(CustomNumberFC);

  return (
    <Formik initialValues={person} onSubmit={noopVoid}>
      <Form>
        {/* Default */}
        <LegacyField name="age" />
        <TypedField name="age" />
        <TypedField name="friends.0.name.first" />

        <LegacyField name="aeg" />
        {/* @ts-expect-error name doesn't match PathOf<Values> */}
        <TypedField name="aeg" />
        {/* @ts-expect-error name doesn't match PathOf<Values> */}
        <TypedField name="friends.NOPE.name.first" />

        <LegacyField name="age" format={(value: string) => {}} />
        <TypedField name="age" format={(value: number) => {}} />
        {/* @ts-expect-error TypedField must match value */}
        <TypedField name="age" format={(value: string) => {}} />

        <LegacyField name="age" aria-required={true} />
        <TypedField name="age" aria-required={true} />
        <TypedField name="friends.0.name.first" aria-required={true} />

        {/* FieldAsString */}
        <LegacyField name="age" as="select" />

        {/* FieldStringComponent */}
        <LegacyField name="age" component="select" />
        <TypedField name="age" component="select" />

        {/* FieldAsComponent */}
        <LegacyField name="age" as={proplessFC} />
        <TypedField name="age" as={proplessFC} />
        <LegacyField name="age" as={propsAnyFC} />
        <TypedField name="age" as={propsAnyFC} />
        <LegacyField name="age" as={PropsAnyClass} />
        <LegacyField name="age" as={partialPropsFC} />
        <LegacyField name="age" as={PartialPropsClass} />

        <LegacyField name="age" as={asAnyFC} />
        <LegacyField name="age" as={asNumberFC} />
        <TypedField name="age" as={asNumberFC} />
        <LegacyField name="age" as={asAnyFC}>
          <div />
        </LegacyField>
        <LegacyField name="age" as={asNumberFC}>
          <div />
        </LegacyField>
        <TypedField name="age" as={asNumberFC}>
          <div />
        </TypedField>
        <LegacyField name="age" as={AsNumberClass} />
        <TypedField name="age" as={AsNumberClass} />

        <TypedField name="age" as={PropsAnyClass} />
        <TypedField name="age" as={PartialPropsClass} />

        {/* @ts-expect-error field value should match */}
        <TypedField name="motto" as={asNumberFC} />
        {/* @ts-expect-error field value should match */}
        <TypedField name="motto" as={AsNumberClass} />

        {/* FieldComponent */}
        <LegacyField name="age" component={proplessFC} />
        <TypedField name="age" component={proplessFC} />
        <LegacyField name="age" component={propsAnyFC} />
        <TypedField name="age" component={propsAnyFC} />
        <LegacyField name="age" component={PropsAnyClass} />
        <LegacyField name="age" component={partialPropsFC} />
        <LegacyField name="age" component={PartialPropsClass} />
        <LegacyField name="age" component={componentAnyFC} />
        <LegacyField name="age" component={componentNumberFC} />
        <TypedField name="age" component={componentNumberFC} />
        <LegacyField name="age" component={componentAnyFC}>
          <div />
        </LegacyField>
        <LegacyField name="age" component={componentNumberFC}>
          <div />
        </LegacyField>
        <TypedField name="age" component={componentNumberFC}>
          <div />
        </TypedField>
        <TypedField name="age" component={PropsAnyClass} />
        <TypedField name="age" component={PartialPropsClass} />
        <LegacyField name="age" component={ComponentNumberClass} />
        <TypedField name="age" component={ComponentNumberClass} />

        {/* @ts-expect-error field value should match */}
        <TypedField name="motto" component={componentNumberFC} />
        {/* @ts-expect-error field value should match */}
        <TypedField name="motto" component={ComponentNumberClass} />

        {/* FieldRender */}
        <LegacyField name="age" render={renderAnyFn} />
        {/* @ts-expect-error render function doesn't have child component */}
        <LegacyField name="age" render={renderAnyFn}>
          <div />
        </LegacyField>

        {/* FieldChildren */}
        <LegacyField name="age" children={renderAnyFn} />
        <LegacyField name="age">{renderAnyFn}</LegacyField>

        {/* Pass-Through Props */}
        <LegacyField<any, any> {...props} />
        <LegacyField {...props} />

        {/* FieldRender */}
        <TypedField name="age" render={renderNumberFN} />
        {/* @ts-expect-error render function doesn't have child component */}
        <TypedField name="age" render={renderNumberFN}>
          <div />
        </TypedField>

        {/* FieldChildren */}
        <TypedField name="age" children={renderNumberFN} />
        <TypedField name="age">{renderNumberFN}</TypedField>

        {/* Pass-Through Props */}
        <TypedField {...props} />

        {/* Custom Fields */}
        {/* Untyped Custom Fields can have anything */}
        <CustomNumberFC name="age" format={value => {}} />
        <TypedNumberFC name="age" format={value => {}} />
        <CustomNumberFC name="motto" />
        {/* @ts-expect-error field value should match */}
        <TypedNumberFC name="motto" />

        {/* @ts-expect-error should match number */}
        <TypedField name="partner.age" value="" />

        {/* @ts-expect-error should match number */}
        <TypedField name="favoriteNumbers.0" value="" />
        {/* @ts-expect-error should match string */}
        <TypedField name="friends.0.name" value={1} />
      </Form>
    </Formik>
  );
};

const AllTests = () => {
  return (
    <>
      <FormTests />
      <FieldTests name="age" />
    </>
  );
};

export default AllTests;
