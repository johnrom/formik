import isEqual from 'react-fast-compare';
import {
  FormikConfig,
  FormikValues,
  FormikMessage,
  emptyErrors,
  emptyTouched,
  useFormikCore,
  FormikHelpers,
  selectHandleReset,
  useCheckableEventCallback,
} from '@formik/core';
import invariant from 'tiny-warning';
import { FormikRefState } from '../types';
import { formikRefReducer } from '../ref-reducer';
import { selectRefGetFieldMeta, selectRefResetForm } from '../ref-selectors';
import {
  useEffect,
  useRef,
  useCallback,
  useReducer,
  useMemo,
  Reducer,
} from 'react';
import { useSubscriptions } from './useSubscriptions';
import { FormikRefApi } from './useFormikApi';

export const useFormik = <Values extends FormikValues = FormikValues>(
  rawProps: FormikConfig<Values, FormikRefState<Values>>
): [FormikRefState<Values>, FormikRefApi<Values>] => {
  const {
    validateOnChange = true,
    validateOnBlur = true,
    validateOnMount = false,
    enableReinitialize = false,
    ...rest
  } = rawProps;
  const props = {
    validateOnChange,
    validateOnBlur,
    validateOnMount,
    ...rest,
  };

  if (__DEV__) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      invariant(
        typeof props.isInitialValid === 'undefined',
        'isInitialValid has been deprecated and will be removed in future versions of Formik. Please use initialErrors or validateOnMount instead.'
      );
      // eslint-disable-next-line
    }, []);
  }

  /**
   * Refs
   */
  const isMounted = useRef<boolean>(false);

  // these are only used for initialization,
  // then abandoned because they will be managed in stateRef
  const initialValues = useRef(props.initialValues);
  const initialErrors = useRef(props.initialErrors ?? emptyErrors);
  const initialTouched = useRef(props.initialTouched ?? emptyTouched);
  const initialStatus = useRef(props.initialStatus);

  /**
   * This is the true test of spacetime. Every method
   * Formik uses must carefully consider whether it
   * needs to use the ref or the render snapshot.
   *
   * The general rule is going to be,
   *       snapshot    ref
   * const [state, updateState] = useFormikThing();
   */
  const stateRef = useRef<FormikRefState<Values>>({
    initialValues: initialValues.current,
    initialErrors: initialErrors.current,
    initialTouched: initialTouched.current,
    initialStatus: initialStatus.current,
    values: props.initialValues,
    errors: props.initialErrors ?? emptyErrors,
    touched: props.initialTouched ?? emptyTouched,
    status: props.initialStatus,
    isSubmitting: false,
    isValidating: false,
    submitCount: 0,
    dirty: false,
  });

  /**
   * Get the current state from anywhere. Not safe to use during render.
   */
  const getState = useCallback(() => stateRef.current, [stateRef]);

  /**
   * Dispatch and pass committed updates to useMutableSource
   */
  const [state, internalDispatch] = useReducer<
    Reducer<
      FormikRefState<Values>,
      FormikMessage<Values, FormikRefState<Values>>
    >
  >(formikRefReducer, stateRef.current);

  // rewrite dispatch to update ref and useReducer separately
  // so that the ref update doesn't get prioritized by the dispatcher.
  const dispatch = useCallback<
    React.Dispatch<FormikMessage<Values, FormikRefState<Values>>>
  >(msg => {
    // update ref, AND dispatch separately
    stateRef.current = formikRefReducer<Values>(stateRef.current, msg);

    internalDispatch(msg);
  }, []);

  // override some APIs to dispatch additional information
  // isMounted is the only ref we actually use, as we
  // override initialX.current with state.initialX
  const formikCoreApi = useFormikCore(getState, dispatch, props, {
    initialValues,
    initialTouched,
    initialErrors,
    initialStatus,
    isMounted,
  });

  const {
    mutableSource,
    getSubscribeFn,
    createSelector,
    createSubscriber,
    getSelector,
  } = useSubscriptions(stateRef, state);

  const getFieldMeta = useCheckableEventCallback(
    () => selectRefGetFieldMeta(getState),
    [getState]
  );

  // todo, sometimes we can include resetForm in imperative methods,
  // and sometimes it just breaks compilation completely
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const resetForm = useCallback(() => {}, []);

  const imperativeMethods: FormikHelpers<Values, FormikRefState<Values>> = {
    ...formikCoreApi,
    resetForm: resetForm as any,
  };

  imperativeMethods.resetForm = useCheckableEventCallback(() =>
    selectRefResetForm(
      getState,
      dispatch,
      props.initialErrors,
      props.initialTouched,
      props.initialStatus,
      props.onReset,
      imperativeMethods
    )
  );

  const handleReset = useCheckableEventCallback(
    () => selectHandleReset(imperativeMethods.resetForm),
    [imperativeMethods.resetForm]
  );

  const { validateForm } = imperativeMethods;

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, [isMounted]);

  useEffect(() => {
    if (
      isMounted.current === true &&
      !isEqual(stateRef.current.initialValues, props.initialValues)
    ) {
      dispatch({ type: 'RESET_VALUES', payload: props.initialValues });

      if (enableReinitialize) {
        resetForm();
      }

      if (validateOnMount) {
        validateForm();
      }
    }
  }, [
    enableReinitialize,
    props.initialValues,
    resetForm,
    validateOnMount,
    validateForm,
    dispatch,
  ]);

  useEffect(() => {
    if (
      enableReinitialize &&
      isMounted.current === true &&
      !isEqual(stateRef.current.initialErrors, props.initialErrors)
    ) {
      dispatch({
        type: 'RESET_ERRORS',
        payload: props.initialErrors || emptyErrors,
      });
    }
  }, [dispatch, enableReinitialize, props.initialErrors]);

  useEffect(() => {
    if (
      enableReinitialize &&
      isMounted.current === true &&
      !isEqual(stateRef.current.initialTouched, props.initialTouched)
    ) {
      dispatch({
        type: 'RESET_TOUCHED',
        payload: props.initialTouched || emptyTouched,
      });
    }
  }, [dispatch, enableReinitialize, props.initialTouched]);

  useEffect(() => {
    if (
      enableReinitialize &&
      isMounted.current === true &&
      !isEqual(stateRef.current.initialStatus, props.initialStatus)
    ) {
      dispatch({
        type: 'RESET_STATUS',
        payload: props.initialStatus,
      });
    }
  }, [dispatch, enableReinitialize, props.initialStatus]);

  /**
   * Here, we memoize the API so that
   * React's Context doesn't update on every render.
   *
   * We don't useMemo because we're purposely
   * only updating when the config updates
   */
  return [
    state,
    useMemo(() => {
      return {
        // the core api
        ...formikCoreApi,
        // the overrides
        resetForm,
        handleReset,
        getFieldMeta,
        // extra goodies
        getState,
        createSelector,
        getSelector,
        createSubscriber,
        mutableSource,
        getSubscribeFn,
        // config
        validateOnBlur,
        validateOnChange,
        validateOnMount,
      };
    }, [
      formikCoreApi,
      resetForm,
      handleReset,
      getFieldMeta,
      getState,
      createSelector,
      getSelector,
      createSubscriber,
      mutableSource,
      getSubscribeFn,
      validateOnBlur,
      validateOnChange,
      validateOnMount,
    ]),
  ];
};
