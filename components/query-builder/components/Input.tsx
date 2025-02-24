import React, { useContext } from "react";
import { GlobalContext, GlobalContextValue } from "../contexts";
import { ClassNames } from "../types";
import { cn } from "../utils";
import { useInput } from "../hooks";

type InputRendererProps = React.ComponentPropsWithRef<"input"> & {
  classNames: ClassNames;
  showBackButton?: boolean;
  showOKButton?: boolean;
  onGoBack: () => void;
  onSelectionChange: (selectedItem: string) => void;
};

export type InputRenderer = (props: InputRendererProps) => React.JSX.Element;

const DefaultInput: InputRenderer = ({
  classNames,
  value,
  showBackButton = false,
  showOKButton = false,
  onGoBack,
  onSelectionChange,
  ...inputProps
}) => {
  return (
    <div className={classNames.inputRoot}>
      {showBackButton && (
        <button
          onClick={onGoBack}
          type="button"
          className={classNames.inputBackButton}
        >
          &lsaquo;
        </button>
      )}

      <input
        {...inputProps}
        value={value}
        className={cn(classNames.input, {
          [classNames.inputBackButtonShown ?? ""]: showBackButton,
          [classNames.inputOKButtonShown ?? ""]: showOKButton,
        })}
      />

      {showOKButton && (
        <button
          onClick={() => onSelectionChange(value as string)}
          // todo: submit button when validation is implemented
          type="button"
          className={classNames.inputOKButton}
        >
          OK
        </button>
      )}
    </div>
  );
};

export type InputProps = {
  render?: InputRenderer;
  shouldFocusOnMount?: boolean;
};

export const Input = ({
  render = DefaultInput,
  shouldFocusOnMount = true,
}: InputProps) => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { classNames } = context;
  const inputProps = useInput({ shouldFocusOnMount });

  return render({
    classNames,
    ...inputProps,
  });
};
