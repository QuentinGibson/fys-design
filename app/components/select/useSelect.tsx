import { useCallback, ChangeEvent } from "react";

export function useSelect<Option>({ selectedOption, options, onChange }: UseSelectParams<Option>) {
  const onChangeCallback = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      /**
      * With the TypeScript noUncheckedIndexedAccess flag enabled
      * the type will be “Option | undefined”!
      */
      const selectedOption = options[event.currentTarget.selectedIndex];

      if (selectedOption !== undefined) {
        /**
        * Note we must check explicitly for undefined, as falsy values
        * like 0, or false can be in the options array!
        */
        onChange(selectedOption);
      }
    },
    [options, onChange]
  );

  return {
    value: options.indexOf(selectedOption),
    onChange: onChangeCallback
  };
};