import { useSelect } from "./useSelect";
import { useSelectOptions } from "./useSelectOption";

export function Select<Option>({
  selectedOption,
  options,
  onChange,
  getLabel,
}: UseSelectParams<Option> & UseSelectOptionsParams<Option>) {
  const selectProps = useSelect({ selectedOption, options, onChange });
  const selectOptions = useSelectOptions({ options, getLabel });

  return <select {...selectProps}>{selectOptions}</select>;
}