import React, { useContext } from "react";
import { GlobalContext, GlobalContextValue } from "../contexts";
import { ClassNames } from "../types";
import { cn } from "../utils";

type DropdownListItemRendererProps = React.ComponentPropsWithRef<"li"> & {
  classNames: ClassNames;
  isActive?: boolean;
};

export type DropdownListItemRenderer = (
  props: DropdownListItemRendererProps
) => React.JSX.Element;

export const DefaultDropdownListItem: DropdownListItemRenderer = ({
  classNames,
  isActive = false,
  ...props
}) => {
  return (
    <li
      {...props}
      className={cn("px-4 py-2 cursor-pointer", classNames.dropdownListItem, {
        "bg-accent text-accent-foreground": isActive,
        "hover:bg-accent hover:text-accent-foreground": !isActive,
      })}
    />
  );
};

export type DropdownListItemProps = {
  index: number;
  render?: DropdownListItemRenderer;
};

export const DropdownListItem = ({
  index,
  render = DefaultDropdownListItem,
}: DropdownListItemProps) => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { classNames, privateAPIref, inputRef, suggestionRefs } = context;

  const suggestion = privateAPIref.current.state.suggestions[index];

  return render({
    classNames,
    isActive: index === privateAPIref.current.state.focusedSuggestionIndex,
    ref: (el) => {
      suggestionRefs.current[index] = el;
    },
    children: suggestion,
    onClick: () => {
      privateAPIref.current.onSelectionChange(suggestion);
      inputRef.current?.focus();
    },
    onMouseEnter: () => privateAPIref.current.setFocusedSuggestionIndex(index),
  });
};
