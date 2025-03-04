import { useCallback, useContext } from "react";
import { GlobalContext, GlobalContextValue } from "../contexts";
import { QueryPart, Step } from "../types";

export type useChipState = {
  isInProgress: boolean;
  column: string;
  comparator?: string;
  value?: string;
  allowDelete: boolean;
  disabled: boolean;
  onDelete: () => void;
} & React.ComponentPropsWithRef<"button">;

export const useChip = (index: number): useChipState => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { privateAPIref, inputRef, chipRefs } = context;

  const isBeingBuilt = index === -1;
  const isInProgress =
    index === privateAPIref.current.state.editedChipIndex || isBeingBuilt;
  const chip = !isInProgress
    ? privateAPIref.current.state.queryParts[index]
    : ({
        column: privateAPIref.current.state.currentQueryPart.column,
        comparator: privateAPIref.current.state.currentQueryPart.comparator,
        value: privateAPIref.current.state.currentQueryPart.value,
      } as QueryPart);

  const handleChipFocused = useCallback(
    ({
      index,
      position,
    }: {
      index?: number;
      position: "first" | "last" | "prev" | "next";
    }) => {
      const chipCount = chipRefs?.current?.length ?? 0;
      let nextIndex: number | undefined;

      if (position === "first") {
        nextIndex = 0;
      } else if (position === "last") {
        nextIndex = chipCount - 1;
      } else if (position === "prev" && index !== undefined) {
        nextIndex = index - 1;
      } else if (position === "next" && index !== undefined) {
        nextIndex = index + 1;
      }

      if (
        nextIndex !== undefined &&
        nextIndex > -1 &&
        nextIndex <= chipCount - 1
      ) {
        chipRefs.current[nextIndex]?.focus();
        return;
      }

      privateAPIref.current.setFocusedChipIndex(-1);
      inputRef.current?.focus();
    },
    [privateAPIref, chipRefs, inputRef]
  );

  const onDelete = (index: number) => {
    privateAPIref.current.setQueryParts(
      privateAPIref.current.state.queryParts.filter((_, i) => i !== index)
    );
    inputRef.current?.focus();
  };

  const onFocus = (index: number) => {
    privateAPIref.current.setFocusedChipIndex(index);
  };

  const onEdit = (index: number) => {
    const partToEdit = privateAPIref.current.state.queryParts[index];
    privateAPIref.current.setCurrentQueryPart(partToEdit);
    privateAPIref.current.setInputValue(partToEdit.column);
    privateAPIref.current.setCurrentStep(Step.column);
    privateAPIref.current.setEditedChipIndex(index);
    inputRef.current?.focus();
  };

  const onKeyDown = (
    e: React.KeyboardEvent<HTMLButtonElement>,
    index: number
  ) => {
    const keyActions: { [key: string]: () => void } = {
      Backspace: () => onDelete(index),
      Delete: () => onDelete(index),
      Enter: () => onEdit(index),
      Tab: () => {
        if (e.shiftKey) {
          handleChipFocused({ index, position: "prev" });
        } else {
          handleChipFocused({ index, position: "next" });
        }
      },
    };

    if (keyActions[e.key]) {
      e.preventDefault();
      keyActions[e.key]();
    }
  };

  const chipRef = (el: HTMLButtonElement | null) => {
    if (el) {
      chipRefs.current[index] = el;
    }
  };

  return {
    isInProgress,
    ...chip,
    allowDelete: !isBeingBuilt,
    disabled: isInProgress,
    onDelete: () => onDelete(index),
    ref: (el) => chipRef(el),
    onKeyDown: (e) => onKeyDown(e, index),
    onFocus: () => onFocus(index),
    "aria-disabled": isInProgress,
  };
};
