
type UseSelectParams<Option> = {
  selectedOption: Option;
  options: readonly Option[];
  onChange: (option: Option) => void
}

type UseSelect = {
  value: number;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void
}

interface SelectHTMLAttributes<T> extends HTMLAttributes<T> {
  value?: string | ReadonlyArray<string> | number | undefined;
}

type UseSelectOptionsParams<Option> = {
  options: readonly Option[];
  getLabel: (option: Option) => string;
};