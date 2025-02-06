import { Context, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const createContextGetterHook = <ContextValue extends unknown>(
  context: Context<ContextValue>,
  contextName: string
) => {
  const useGetContext = (): NonNullable<ContextValue> => {
    const value = useContext<ContextValue>(context);
    if (value) return value;
    throw new Error(`Context "${contextName}" not found.`);
  };

  return useGetContext;
};
