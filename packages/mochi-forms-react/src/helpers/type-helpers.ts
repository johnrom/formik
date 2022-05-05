export type NoInfer<A> = [A][A extends any ? 0 : never];

export type ComponentMaybeAcceptingProps<
  Component extends React.ElementType<any>,
  TargetProps
> = [Partial<TargetProps>] extends [Partial<React.ComponentProps<Component>>]
  ? Component
  : [React.ComponentProps<Component>] extends [Record<keyof TargetProps, any>]
  ? never
  : Component;

export type ComponentNeverRequiringProps<
  Component extends React.ElementType<any>,
  TargetProps extends string
> = [Partial<Record<TargetProps, undefined>>] extends [
  React.ComponentProps<Component>
]
  ? Component
  : [React.ComponentProps<Component>] extends [Record<TargetProps, any>]
  ? never
  : Component;
