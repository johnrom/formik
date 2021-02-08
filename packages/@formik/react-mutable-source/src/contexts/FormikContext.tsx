import { createContext } from 'react';
import { FormikRefApi } from '../hooks/useFormikApi';

export const FormikContext = createContext<FormikRefApi<any> | undefined>(
  undefined as any
);
export const FormikProvider = FormikContext.Provider;
