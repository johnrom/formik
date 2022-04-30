import React from 'react';
import ReactDOM from 'react-dom';
import { Formik, LegacyField, Form } from '@mochi-forms/react';
import formatString from 'format-string-by-pattern';
import { sleep } from '../helpers';

const masks = [
  { name: 'phone-1', parse: '999-999-9999' },
  { name: 'phone-2', parse: '(999) 999-9999' },
  { name: 'phone-3', parse: '+49 (AAAA) BBBBBB' },
] as const;

type UnArray<T> = T extends readonly (infer V)[] ? V : T;
type MaskedValues = Record<UnArray<typeof masks>['name'], string>;

const FormatStringByPatternExample = () => {
  return (
    <div>
      <Formik
        initialValues={masks.reduce<MaskedValues>((prev, curr) => {
          prev[curr.name] = '';
          return prev;
        }, {} as any)}
        onSubmit={async values => {
          await sleep(500);
          alert(JSON.stringify(values, null, 2));
        }}
        render={({ values }) => (
          <Form>
            {masks.map(mask => (
              <div key={mask.name}>
                <label>
                  {mask.name}
                  <LegacyField
                    name={mask.name}
                    parse={formatString(mask.parse)}
                    placeholder={mask.parse}
                  />
                </label>
              </div>
            ))}

            <button type="submit">Submit</button>
            <pre>{JSON.stringify(values, null, 2)}</pre>
          </Form>
        )}
      />
    </div>
  );
};

export default FormatStringByPatternExample;
