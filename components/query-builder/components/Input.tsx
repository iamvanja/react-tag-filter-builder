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
    <div className={cn("relative w-[260px] mb-1", classNames.inputRoot)}>
      {/* todo: renderBackButton */}
      {showBackButton && (
        <button
          onClick={onGoBack}
          type="button"
          className={cn(
            "absolute inset-y-0 start-0 flex items-center ps-3 pe-3 border-r-[1px] text-gray-800 whitespace-nowrap font-medium rounded-md rounded-r-none m-[1px] mr-0 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground text-lg",
            classNames.inputBackButton
          )}
        >
          &lsaquo;
        </button>
      )}

      {/* todo: render input */}
      <input
        {...inputProps}
        value={value}
        className={cn(
          "block w-full p-4 h-[34px] rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-0 focus:border-slate-600",
          {
            "ps-10": showBackButton,
            "pe-16": showOKButton,
          },
          classNames.input
        )}
      />

      {/* todo: renderOKButton */}
      {showOKButton && (
        <button
          onClick={() => onSelectionChange(value as string)}
          // todo: submit button when validation is implemented
          type="button"
          className={cn(
            "absolute right-0 bottom-0 top-0 mt-1 mb-1 mr-1 text-[12px] py-2 px-4 leading-none whitespace-nowrap rounded-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-slate-600 text-primary-foreground hover:bg-slate-500",
            classNames.inputOKButton
          )}
        >
          OK
        </button>
      )}
    </div>
  );
};

export type InputProps = {
  render?: InputRenderer;
};

export const Input = ({ render = DefaultInput }: InputProps) => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { classNames } = context;
  const inputProps = useInput();

  return render({
    classNames,
    ...inputProps,
  });
};
