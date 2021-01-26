import * as React from 'react';
import cloneDeep from 'lodash/cloneDeep';
import {
  FormikState,
  getIn,
  isFunction,
  setIn,
  isEmptyArray,
  FieldMetaProps,
  useCheckableEventCallback,
} from '@formik/core';
import { FormikRefApi, useFormikApi } from './useFormikApi';
import { useField } from './useField';
import { arraySwap, arrayMove, arrayInsert, arrayReplace } from '../../dist';
import { copyArrayLike } from '../helpers/array-helpers';

export interface UseFieldArrayProps {
  /** Really the path to the array field to be updated */
  name: string;
  /** Should field array validate the form AFTER array updates/changes? */
  validateOnChange?: boolean;
}

export interface ArrayHelpers {
  /** Imperatively add a value to the end of an array */
  push: (obj: any) => void;
  /** Curried fn to add a value to the end of an array */
  handlePush: (obj: any) => () => void;
  /** Imperatively swap two values in an array */
  swap: (indexA: number, indexB: number) => void;
  /** Curried fn to swap two values in an array */
  handleSwap: (indexA: number, indexB: number) => () => void;
  /** Imperatively move an element in an array to another index */
  move: (from: number, to: number) => void;
  /** Imperatively move an element in an array to another index */
  handleMove: (from: number, to: number) => () => void;
  /** Imperatively insert an element at a given index into the array */
  insert: (index: number, value: any) => void;
  /** Curried fn to insert an element at a given index into the array */
  handleInsert: (index: number, value: any) => () => void;
  /** Imperatively replace a value at an index of an array  */
  replace: (index: number, value: any) => void;
  /** Curried fn to replace an element at a given index into the array */
  handleReplace: (index: number, value: any) => () => void;
  /** Imperatively add an element to the beginning of an array and return its length */
  unshift: (value: any) => number;
  /** Curried fn to add an element to the beginning of an array */
  handleUnshift: (value: any) => () => void;
  /** Curried fn to remove an element at an index of an array */
  handleRemove: (index: number) => () => void;
  /** Curried fn to remove a value from the end of the array */
  handlePop: () => () => void;
  /** Imperatively remove and element at an index of an array */
  remove<T>(index: number): T | undefined;
  /** Imperatively remove and return value from the end of the array */
  pop<T>(): T | undefined;
}

export const useFieldArray = <Values, Value>(
  props: UseFieldArrayProps
): [FieldMetaProps<Value[]>, ArrayHelpers, FormikRefApi<Values>] => {
  const formikApi = useFormikApi<Values>();
  const { setFormikState } = formikApi;
  const [, fieldMeta] = useField<Value[]>(props.name);

  const updateArrayField = useCheckableEventCallback(
    () => (
      // eslint-disable-next-line @typescript-eslint/ban-types
      fn: Function,
      // eslint-disable-next-line @typescript-eslint/ban-types
      alterTouched: boolean | Function,
      // eslint-disable-next-line @typescript-eslint/ban-types
      alterErrors: boolean | Function
    ) => {
      const name = props.name;

      setFormikState((prevState: FormikState<any>) => {
        const updateErrors =
          typeof alterErrors === 'function' ? alterErrors : fn;
        const updateTouched =
          typeof alterTouched === 'function' ? alterTouched : fn;

        // values fn should be executed before updateErrors and updateTouched,
        // otherwise it causes an error with unshift.
        const values = setIn(
          prevState.values,
          name,
          fn(getIn(prevState.values, name))
        );

        let fieldError = alterErrors
          ? updateErrors(getIn(prevState.errors, name))
          : undefined;
        let fieldTouched = alterTouched
          ? updateTouched(getIn(prevState.touched, name))
          : undefined;

        if (isEmptyArray(fieldError)) {
          fieldError = undefined;
        }
        if (isEmptyArray(fieldTouched)) {
          fieldTouched = undefined;
        }

        return {
          ...prevState,
          values,
          errors: alterErrors
            ? setIn(prevState.errors, name, fieldError)
            : prevState.errors,
          touched: alterTouched
            ? setIn(prevState.touched, name, fieldTouched)
            : prevState.touched,
        };
      });
    },
    [props.name, setFormikState]
  );

  const push = useCheckableEventCallback(
    () => (value: any) =>
      updateArrayField(
        (arrayLike: ArrayLike<any>) => [
          ...copyArrayLike(arrayLike),
          cloneDeep(value),
        ],
        false,
        false
      ),
    [updateArrayField]
  );

  const handlePush = useCheckableEventCallback(
    () => (value: any) => () => push(value),
    [push]
  );

  const swap = useCheckableEventCallback(
    () => (indexA: number, indexB: number) =>
      updateArrayField(
        (array: any[]) => arraySwap(array, indexA, indexB),
        true,
        true
      ),
    [updateArrayField]
  );

  const handleSwap = useCheckableEventCallback(
    () => (indexA: number, indexB: number) => () => swap(indexA, indexB),
    [swap]
  );

  const move = useCheckableEventCallback(
    () => (from: number, to: number) =>
      updateArrayField(
        (array: any[]) => arrayMove(array, from, to),
        true,
        true
      ),
    [updateArrayField]
  );

  const handleMove = useCheckableEventCallback(
    () => (from: number, to: number) => () => move(from, to),
    [move]
  );

  const insert = useCheckableEventCallback(
    () => (index: number, value: any) =>
      updateArrayField(
        (array: any[]) => arrayInsert(array, index, value),
        (array: any[]) => arrayInsert(array, index, null),
        (array: any[]) => arrayInsert(array, index, null)
      ),
    [updateArrayField]
  );

  const handleInsert = useCheckableEventCallback(
    () => (index: number, value: any) => () => insert(index, value),
    [insert]
  );

  const replace = useCheckableEventCallback(
    () => (index: number, value: any) =>
      updateArrayField(
        (array: any[]) => arrayReplace(array, index, value),
        false,
        false
      ),
    [updateArrayField]
  );

  const handleReplace = useCheckableEventCallback(
    () => (index: number, value: any) => () => replace(index, value),
    [replace]
  );

  const unshift = useCheckableEventCallback(
    () => (value: any) => {
      let length = -1;
      updateArrayField(
        (array: any[]) => {
          const arr = array ? [value, ...array] : [value];
          if (length < 0) {
            length = arr.length;
          }
          return arr;
        },
        (array: any[]) => {
          const arr = array ? [null, ...array] : [null];
          if (length < 0) {
            length = arr.length;
          }
          return arr;
        },
        (array: any[]) => {
          const arr = array ? [null, ...array] : [null];
          if (length < 0) {
            length = arr.length;
          }
          return arr;
        }
      );
      return length;
    },
    [updateArrayField]
  );

  const handleUnshift = useCheckableEventCallback(
    () => (value: any) => () => unshift(value),
    [unshift]
  );

  const remove = useCheckableEventCallback(
    () => <T,>(index: number): T => {
      // We need to make sure we also remove relevant pieces of `touched` and `errors`
      let result: any;
      updateArrayField(
        // so this gets call 3 times
        (array?: any[]) => {
          const copy = array ? copyArrayLike(array) : [];
          if (!result) {
            result = copy[index];
          }
          if (isFunction(copy.splice)) {
            copy.splice(index, 1);
          }
          return copy;
        },
        true,
        true
      );

      return result as T;
    },
    [updateArrayField]
  );

  const handleRemove = useCheckableEventCallback(
    () => (index: number) => () => remove<any>(index),
    [remove]
  );

  const pop = useCheckableEventCallback(
    () => <T,>(): T => {
      // Remove relevant pieces of `touched` and `errors` too!
      let result: any;
      updateArrayField(
        // so this gets call 3 times
        (array: any[]) => {
          const tmp = array;
          if (!result) {
            result = tmp && tmp.pop && tmp.pop();
          }
          return tmp;
        },
        true,
        true
      );

      return result as T;
    },
    [updateArrayField]
  );

  const handlePop = useCheckableEventCallback(() => () => () => pop<any>(), [
    pop,
  ]);

  /**
   * Memoize for stability
   */
  return [
    fieldMeta,
    React.useMemo(
      () => ({
        push,
        handlePush,
        swap,
        handleSwap,
        move,
        handleMove,
        insert,
        handleInsert,
        replace,
        handleReplace,
        unshift,
        handleUnshift,
        handleRemove,
        handlePop,
        remove,
        pop,
      }),
      [
        handleInsert,
        handleMove,
        handlePop,
        handlePush,
        handleRemove,
        handleReplace,
        handleSwap,
        handleUnshift,
        insert,
        move,
        pop,
        push,
        remove,
        replace,
        swap,
        unshift,
      ]
    ),
    formikApi,
  ];
};
