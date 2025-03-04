import { useCallback, useContext, useEffect } from "react";
import { GlobalContext, GlobalContextValue } from "../contexts";
import { Step } from "../types";

export type useInputState = {
  showBackButton?: boolean;
  showOKButton?: boolean;
  onGoBack: () => void;
  onSelectionChange: (selectedItem: string) => void;
} & React.ComponentPropsWithRef<"input">;

export type UseInputArgs = {
  shouldFocusOnMount: boolean;
};

export const useInput = ({
  shouldFocusOnMount,
}: UseInputArgs): useInputState => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { privateAPIref, inputRef } = context;

  const { allowNoMatchSelection, ...inputProps } =
    privateAPIref.current.inputPropsPerStep();

  useEffect(() => {
    if (shouldFocusOnMount) {
      inputRef?.current?.focus();
    }

    // unfocus chip when focused outside the input
    if (inputRef?.current === document.activeElement) {
      privateAPIref.current.setFocusedChipIndex(-1);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    privateAPIref.current.setInputValue(value);

    privateAPIref.current.updateSuggestions(value);

    if (privateAPIref.current.onInputChange) {
      privateAPIref.current.onInputChange(e);
    }
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
      } else if (e.key === "Backspace" && state.inputValue === "") {
        e.preventDefault();
        handleGoBack();
      }

      // allow parent component to still implement its onKeyDown event
      if (privateAPIref.current.onInputKeyDown) {
        privateAPIref.current.onInputKeyDown(e);
      }
    },
    [privateAPIref, allowNoMatchSelection]
  );

  return {
    value: privateAPIref.current.state.inputValue,
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
