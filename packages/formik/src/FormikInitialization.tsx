export interface FormikPlugin<Config = {}, Api = {}, State = {}> {
  usePlugin: (config: Config) => void;
}

export interface FormikRoot<Plugins extends FormikPlugin[] = []> {
  plugins: FormikPlugin[];
  addPlugin: <Plugin extends FormikPlugin,>(
    plugin: Plugin
  ) => FormikRoot<[...Plugins, Plugin]>;
}

export const createFormik = <Plugins extends FormikPlugin[]>(plugins: Plugins): FormikRoot<Plugins> => {
  return {
    plugins,
    addPlugin: (plugin) => createFormik([...plugins, plugin])
  }
}

interface FormikStatusConfig<Status> {
  initialStatus: Status,
}

interface FormikStatusApi<Status> {
  setStatus: (status: Status) => void;
}

interface FormikStatusActions {

  case 'SET_STATUS':
    return { ...state, status: msg.payload };
}

const FormikUsePluginContext = {
  config: Config
}

const formikStatusPlugin = <Status,>() => <Plugins extends FormikPlugin[]>(
  plugins: Plugins
) => {
  const initialize = () => {};

  const usePlugin = (config: {
    initialStatus: Status,
  }, context: FormikPluginContext<Plugins>) => {

  }

  return { initialize, usePlugin };
}