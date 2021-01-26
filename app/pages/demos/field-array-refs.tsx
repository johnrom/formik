import React from 'react';
import { Formik, Form, Field, FieldArray } from '@formik/reducer-refs';

const initialValues = { friends: ['jared', 'ian', 'brent'] };

// Here is an example of a form with an editable list.
// Next to each input are buttons for insert and remove.
// If the list is empty, there is a button to add an item.
export const FriendList = () => (
  <div>
    <h1>Friend List</h1>
    <Formik
      initialValues={initialValues}
      onSubmit={values => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
        }, 500);
      }}
    >
      <Form>
        <FieldArray<typeof initialValues, string>
          name="friends"
          render={fieldArray => (
            <div>
              {fieldArray.field.value && fieldArray.field.value.length > 0 ? (
                fieldArray.field.value.map((friend, index) => (
                  <div key={index}>
                    <Field name={`friends.${index}`} />
                    <button
                      type="button"
                      onClick={() => fieldArray.remove(index)} // remove a friend from the list
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => fieldArray.insert(index, '')} // insert an empty string at a position
                    >
                      +
                    </button>
                  </div>
                ))
              ) : (
                <button type="button" onClick={() => fieldArray.push('')}>
                  {/* show this when user has removed all friends from the list */}
                  Add a friend
                </button>
              )}
              <div>
                <button type="submit">Submit</button>
              </div>
            </div>
          )}
        />
      </Form>
    </Formik>
  </div>
);

export default FriendList;
