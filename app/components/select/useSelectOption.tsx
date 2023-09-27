
export function useSelectOptions<Option>({
  options,
  getLabel
}: UseSelectOptionsParams<Option>) {
  return (
    <>
      {options.map((option, index) => (
        <option key={index} value={index}>
          {getLabel(option)}
        </option>
      ))}
    </>
  );
}