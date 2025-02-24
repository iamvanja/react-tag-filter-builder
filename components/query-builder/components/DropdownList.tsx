import React, { useContext, useEffect } from "react";
import { GlobalContext, GlobalContextValue } from "../contexts";
import { ClassNames } from "../types";
import { cn } from "../utils";
import {
  DropdownListItem,
  DropdownListItemRenderer,
  DefaultDropdownListItem,
} from "./DropdownListItem";
import { useDropdownList } from "../hooks";

type DropdownListRendererProps = React.ComponentPropsWithRef<"ul"> & {
  suggestions: string[];
  classNames: ClassNames;
  renderItem: DropdownListItemRenderer;
};

export type DropdownListRenderer = (
  props: DropdownListRendererProps
) => React.JSX.Element;

export const DefaultDropdownList: DropdownListRenderer = ({
  classNames,
  suggestions,
  ref,
  renderItem,
}) => {
  return (
    <ul className={cn(classNames.dropdownList)} ref={ref}>
      {suggestions.map((_, index) => (
        <DropdownListItem
          key={`dropdown-list-item-${index}`}
          index={index}
          render={renderItem}
        />
      ))}
    </ul>
  );
};

export type DropdownListProps = {
  render?: DropdownListRenderer;
  renderItem?: DropdownListItemRenderer;
};

export const DropdownList = ({
  render = DefaultDropdownList,
  renderItem = DefaultDropdownListItem,
}: DropdownListProps) => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { classNames, privateAPIref } = context;
  const dropdownListProps = useDropdownList();
  const shouldRender =
    privateAPIref.current.state.isInputFocused &&
    privateAPIref.current.state.suggestions.length > 0;

  if (!shouldRender) {
    return null;
  }

  return render({ classNames, renderItem, ...dropdownListProps });
};
