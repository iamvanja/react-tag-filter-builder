import React, { useContext } from "react";
import { GlobalContext, GlobalContextValue } from "../contexts";
import { ClassNames, QueryPart } from "../types";
import { Chip, ChipRenderer, DefaultChip } from "./Chip";
import { cn } from "../utils";

type ChipListRendererProps = React.ComponentPropsWithRef<"ul"> & {
  classNames: ClassNames;
  renderItem: ChipRenderer;
  chips: QueryPart[];
  showChipInProgress?: boolean;
};

export type ChipListRenderer = (
  props: ChipListRendererProps
) => React.JSX.Element;

export const DefaultChipList: ChipListRenderer = ({
  classNames,
  renderItem,
  chips,
  showChipInProgress = false,
  ...chipListProps
}: ChipListRendererProps) => {
  return (
    <ul className={cn(classNames.chipList)} {...chipListProps} role="list">
      {chips.map((_, index) => (
        <li
          className={cn(classNames.chipListItem)}
          key={`query-part-li-${index}`}
          role="listitem"
        >
          <Chip render={renderItem} index={index} />
        </li>
      ))}

      {showChipInProgress && (
        <li className={cn(classNames.chipListItemEdited)} role="listitem">
          <Chip render={renderItem} index={-1} />
        </li>
      )}
    </ul>
  );
};

export type chipListProps = {
  render?: ChipListRenderer;
  renderItem?: ChipRenderer;
};

export const ChipList = ({
  render = DefaultChipList,
  renderItem = DefaultChip,
}: chipListProps) => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { classNames, privateAPIref } = context;

  return render({
    classNames,
    renderItem,
    chips: privateAPIref.current.state.queryParts,
    showChipInProgress: Boolean(
      privateAPIref.current.state.currentQueryPart.column &&
        privateAPIref.current.state.editedChipIndex === null
    ),
  });
};
