import React from 'react';
import {
  Formik,
  Form,
  ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { NumberAsField } from 'app/components/fields/number-as-field';
import { EmailFieldAsClass } from 'app/components/fields/email-field-as-class';
import { NumberComponentField } from 'app/components/fields/number-component-field';
import { createTypedFields } from 'app/components/fields';
import { NumberRepeaterField } from 'app/components/fields/number-repeater-field';

let renderCount = 0;

interface NameValue {
  first: string,
  last: string,
}

type BasePerson = {
  name: NameValue,
  email: string,
  hasNicknames: boolean,
  age: number | '',
  favoriteFood: string,
  favoriteNumber: number,
  nicknames: string[],
  favoriteFoods: string[],
  favoriteNumbers: (number | "")[];
  motto: string;
}

type FormValues = BasePerson & {
  partner: BasePerson;
  friends: BasePerson[];
}

const basePerson: BasePerson = {
  name: {
    first: "",
    last: "",
  },
  email: "",
  hasNicknames: false,
  nicknames: [],
  favoriteFood: "",
  favoriteNumber: 0,
  favoriteFoods: [],
  age: 21,
  favoriteNumbers: [],
  motto: "",
}

const initialValues: FormValues = {
  ...basePerson,
  partner: basePerson,
  friends: [
    basePerson,
    basePerson
  ]
};

const fields = createTypedFields<FormValues>();

const StronglyTypedPage = () => (
  <div>
    <h1>Sign Up</h1>
    <Formik
      initialValues={initialValues}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Required'),
        firstName: Yup.string().required('Required'),
        lastName: Yup.string()
          .min(2, 'Must be longer than 2 characters')
          .max(20, 'Nice try, nobody has a last name that long')
          .required('Required'),
      })}
      onSubmit={async values => {
        await new Promise(r => setTimeout(r, 500));
        alert(JSON.stringify(values, null, 2));
      }}
    >
      <Form>
        <fields.Field
          name="name.first"
          placeholder="Jane"
        />
        <ErrorMessage<FormValues> name="name.first" component="p" />

        <fields.Field
          name="name.last"
          placeholder="Doe"
        />
        <ErrorMessage<FormValues> name="name.last" component="p" />

        <fields.Field
          name="email"
          as={EmailFieldAsClass}
          type="email"
        />
        <ErrorMessage<FormValues> name="email" component="p" />

        <fields.Field
          name="age"
          as={NumberAsField}
          type="number"
        />

        <fields.Field
         name="age"
        />

        <fields.NumberField
          name="age"
          as={NumberAsField}
          type="number"
        />

        <fields.Field
          name="favoriteNumbers.0"
          as={NumberAsField}
          type="number"
        />

        <fields.Field
          name="friends.0.favoriteNumbers.0"
          component={NumberComponentField}
          type="number"
        />

        <fields.FieldArray
          name="favoriteNumbers"
          component={NumberRepeaterField}
        />

        <label>
          <fields.Field type="checkbox" name="hasNicknames" />
          <span style={{ marginLeft: 3 }}>Toggle</span>
        </label>

        {/* todo: FieldArray for nicknames */}

        <div id="checkbox-group">Checkbox Group</div>
        <div role="group" aria-labelledby="checkbox-group">
          <label>
            <fields.Field type="checkbox" name="favoriteFood" value="Pizza" />
            Pizza
          </label>
          <label>
            <fields.Field type="checkbox" name="favoriteFood" value="Falafel" />
            Falafel
          </label>
          <label>
            <fields.Field type="checkbox" name="favoriteFood" value="Dim Sum" />
            Dim Sum
          </label>
        </div>
        <div id="my-radio-group">Picked</div>
        <div role="group" aria-labelledby="my-radio-group">
          <label>
            <fields.Field type="radio" name="favoriteNumber" value={1} parse={val => typeof val === "string" ? parseInt(val, 10) : ""} />
            1
          </label>
          <label>
            <fields.Field type="radio" name="favoriteNumber" value={2} />
            2
          </label>
        </div>
        <div>
          <label>
            Textarea
            <fields.Field name="motto" as="textarea" />
          </label>
        </div>
        <button type="submit">Submit</button>
        <div id="renderCounter">{renderCount++}</div>
      </Form>
    </Formik>
  </div>
);

export default StronglyTypedPage;
