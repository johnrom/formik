import { ComponentMaybeAcceptingProps, ComponentNeverRequiringProps } from '../src/helpers/type-helpers';
import {
  noPropsFc,
  anyPropsFc,
  optionalNameFC,
  requiredNameFC,
  optionalOnChangeFC,
  badNameFC,
} from './test-helpers';

const componentMaybeAcceptingName_noPropsFc: ComponentMaybeAcceptingProps<
  typeof noPropsFc,
  { name: string }
> = noPropsFc;
const componentMaybeAcceptingName_anyPropsFc: ComponentMaybeAcceptingProps<
  typeof anyPropsFc,
  { name: string }
> = anyPropsFc;
const componentMaybeAcceptingName_optionalNameFc: ComponentMaybeAcceptingProps<
  typeof optionalNameFC,
  { name: string }
> = optionalNameFC;
const componentMaybeAcceptingName_requiredNameFc: ComponentMaybeAcceptingProps<
  typeof requiredNameFC,
  { name: string }
> = requiredNameFC;
const componentMaybeAcceptingName_optionalOnChangeFc: ComponentMaybeAcceptingProps<
  typeof optionalOnChangeFC,
  { name: string }
  > = optionalOnChangeFC;
// @ts-expect-error name, if accepted, must equal string
const componentMaybeAcceptingName_badNameFc: ComponentMaybeAcceptingProps<
  typeof badNameFC,
  { name?: string }
> = badNameFC;

const componentNeverAcceptingName_noPropsFc: ComponentNeverRequiringProps<
  typeof noPropsFc,
  'name'
> = noPropsFc;
const componentNeverAcceptingName_anyPropsFc: ComponentNeverRequiringProps<
  typeof anyPropsFc,
  'name'
> = anyPropsFc;
const componentNeverAcceptingName_optionalNameFc: ComponentNeverRequiringProps<
  typeof optionalNameFC,
  'name'
> = optionalNameFC;
const componentNeverAcceptingName_optionalOnChangeFc: ComponentNeverRequiringProps<
  typeof optionalOnChangeFC,
  'name'
> = optionalOnChangeFC;
// @ts-expect-error name cannot be required
const componentNeverAcceptingName_requiredNameFc: ComponentNeverRequiringProps<
  typeof requiredNameFC,
  'name'
> = requiredNameFC;