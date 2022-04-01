import { Formik, Field, Form } from '@mochi-forms/react';
import type { NextPage } from 'next';
import { DebugProps } from '../../components/debugging/DebugProps';
import { alertOnSubmit } from '../../helpers/example-helpers';

interface PizzaPartyToppingsValues {
  extraCheese: boolean;
  toppings: [];
}

const CheckboxesPage: NextPage = () => (
  <div>
    <h1>Sign Up</h1>
    <Formik<PizzaPartyToppingsValues>
      initialValues={{
        extraCheese: false,
        toppings: [],
      }}
      onSubmit={alertOnSubmit}
    >
      {(props) => (
        <Form>
          <label>
            <Field type="checkbox" name="toggle" /> Do you want toppings?
          </label>

          <fieldset>
            <legend>Toppings</legend>
            <label>
              <Field type="checkbox" name="checked" value="Pepperoni" />
              Pepperoni
            </label>
            <label>
              <Field type="checkbox" name="checked" value="Mushroom" />
              Mushroom
            </label>
            <label>
              <Field type="checkbox" name="checked" value="Black Olives" />
              Black Olives
            </label>
          </fieldset>

          <button type="submit">Submit</button>

          <DebugProps props={props} />
        </Form>
      )}
    </Formik>
  </div>
);

export default CheckboxesPage;
