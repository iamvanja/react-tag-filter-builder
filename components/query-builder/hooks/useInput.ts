import { useCallback, useContext } from "react";
import { GlobalContext, GlobalContextValue } from "../contexts";
import { Step } from "../types";

export type useInputState = {
  showBackButton?: boolean;
  showOKButton?: boolean;
  onGoBack: () => void;
  onSelectionChange: (selectedItem: string) => void;
} & React.ComponentPropsWithRef<"input">;

export const useInput = (): useInputState => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { privateAPIref, inputRef } = context;

  const { allowNoMatchSelection, ...inputProps } =
    privateAPIref.current.inputPropsPerStep();

  const value = privateAPIref.current.state.inputValue;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    privateAPIref.current.setInputValue(value);

    // todo: debounce this
    privateAPIref.current.updateSuggestions(value);

    // props?.onChange() // todo
  };

  const onSelectionChange = (suggestion: string) => {
    privateAPIref.current.onSelectionChange(suggestion);
    inputRef.current?.focus();
  };

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const {
        onSelectionChange,
        setFocusedSuggestionIndex,
        handleGoBack,
        state,
      } = privateAPIref.current;
      // allow parent component to still implement its onKeyDown event
      // props.onKeyDown?.(e); // todo

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setFocusedSuggestionIndex((prev) =>
          prev < state.suggestions.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setFocusedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter") {
        e.preventDefault();
        let finalValue = state.suggestions[state.focusedSuggestionIndex];

        if (state.focusedSuggestionIndex === -1 && allowNoMatchSelection) {
          finalValue = state.inputValue;
        }

        if (finalValue) {
          onSelectionChange(finalValue);
        }
      }

      if (e.key === "Backspace" && state.inputValue === "") {
        e.preventDefault();
        handleGoBack();
      }
    },
    [privateAPIref, allowNoMatchSelection]
  );

  return {
    value,
    ref: inputRef,
    onKeyDown,
    onChange,
    onFocus: () => privateAPIref.current.setInputFocused(true),
    showBackButton: privateAPIref.current.state.currentStep !== Step.column,
    showOKButton: privateAPIref.current.state.currentStep === Step.value,
    onGoBack: privateAPIref.current.handleGoBack,
    onSelectionChange: onSelectionChange,
    ...inputProps,
  };
};
