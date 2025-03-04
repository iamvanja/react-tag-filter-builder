import React, { forwardRef, useRef } from "react";
import { QueryPart, Column, ClassNames, PublicAPI } from "../types";
import { ChipRenderer } from "./Chip";

import { GlobalContext } from "../contexts";
import { usePrivateAPI } from "../hooks/usePrivateAPI";
import { Debug, DebugRenderer } from "./Debug";
import { TopBar, TopBarRenderer } from "./TopBar";
import { usePublicAPI } from "../hooks";
import { ChipList, ChipListRenderer } from "./ChipList";
import { Input, InputRenderer } from "./Input";
import { DropdownList, DropdownListRenderer } from "./DropdownList";
import { DropdownListItemRenderer } from "./DropdownListItem";
import { MainRow, MainRowRenderer } from "./MainRow";

type QueryBuilderProps = {
  columns: Column[];
  isDebug?: boolean;
  classNames?: ClassNames;
  onFilterChange?: (queryParts: QueryPart[]) => void;
  onInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  initialFilter?: QueryPart[];
  localStorageKey?: string;
  shouldPersistData?: boolean;
  shouldFocusOnMount?: boolean;
  renderDebug?: DebugRenderer;
  renderTopBar?: TopBarRenderer;
  renderChipList?: ChipListRenderer;
  renderChip?: ChipRenderer;
  renderInput?: InputRenderer;
  renderDropdownList?: DropdownListRenderer;
  renderDropdownListItem?: DropdownListItemRenderer;
  renderMainRow?: MainRowRenderer;
};
const LS_QUERY_PARTS_KEY = "filter";

export const defaultClassnames: ClassNames = {
  root: "query-builder-root",
  debug: "query-builder-debug",
  topBar: "query-builder-top-bar",
  helperText: "query-builder-helper-text",
  removeAllButton: "query-builder-remove-all-button",
  chipList: "query-builder-chip-list",
  chipListItem: "query-builder-chip-list-item",
  chipListItemEdited: "query-builder-chip-list-item-edited",
  chip: "query-builder-chip",
  chipInProgress: "query-builder-chip-in-progress",
  chipColumn: "query-builder-chip-column",
  chipComparator: "query-builder-chip-comparator",
  chipValue: "query-builder-chip-value",
  chipDelete: "query-builder-chip-delete",
  chipSkeleton: "query-builder-chip-skeleton",
  chipSkeletonComparator: "query-builder-chip-skeleton-comparator",
  chipSkeletonValue: "query-builder-chip-skeleton-value",
  inputRoot: "query-builder-input-root",
  inputBackButton: "query-builder-input-back-button",
  inputOKButton: "query-builder-input-ok-button",
  input: "query-builder-input",
  inputBackButtonShown: "query-builder-input-back-button-shown",
  inputOKButtonShown: "query-builder-input-ok-button-shown",
  dropdownList: "query-builder-dropdown-list",
  dropdownListItem: "query-builder-dropdown-list-item",
  dropdownListItemActive: "query-builder-dropdown-list-item-active",
  mainRow: "query-builder-main-row",
  mainRowIsActive: "query-builder-main-row-is-active",
  comboBox: "query-builder-combo-box",
};

const QueryBuilder = forwardRef<PublicAPI, QueryBuilderProps>(
  (
    {
      columns,
      isDebug = false,
      classNames = defaultClassnames,
      onFilterChange,
      onInputChange,
      onInputKeyDown,
      initialFilter = [],
      localStorageKey = LS_QUERY_PARTS_KEY,
      shouldPersistData = false,
      shouldFocusOnMount = false,
      renderDebug,
      renderTopBar,
      renderChipList,
      renderChip,
      renderInput,
      renderDropdownList,
      renderDropdownListItem,
      renderMainRow,
    },
    ref?
  ) => {
    const mainRowRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const chipRefs = useRef<HTMLButtonElement[]>([]);
    const suggestionDropdownRef = useRef<HTMLUListElement>(null!);
    const suggestionRefs = useRef<(HTMLLIElement | null)[]>([]);

    const privateAPIref = usePrivateAPI({
      columns,
      initialFilter,
      shouldPersistData,
      localStorageKey,
      onFilterChange,
      onInputChange,
      onInputKeyDown,
    });
    const publicAPI = usePublicAPI({ inputRef });

    if (ref) {
      if (typeof ref === "function") {
        ref(publicAPI);
      } else {
        ref.current = publicAPI;
      }
    }

    return (
      <GlobalContext.Provider
        value={{
          mainRowRef,
          inputRef,
          chipRefs,
          suggestionDropdownRef,
          suggestionRefs,
          privateAPIref,
          classNames,
        }}
      >
        <div className={classNames.root}>
          {isDebug && <Debug render={renderDebug} />}

          <TopBar render={renderTopBar} />

          <MainRow render={renderMainRow}>
            <ChipList render={renderChipList} renderItem={renderChip} />

            <div className={classNames.comboBox}>
              <Input
                render={renderInput}
                shouldFocusOnMount={shouldFocusOnMount}
              />

              <DropdownList
                render={renderDropdownList}
                renderItem={renderDropdownListItem}
              />
            </div>
          </MainRow>
        </div>
      </GlobalContext.Provider>
    );
  }
);

QueryBuilder.displayName = "QueryBuilder";

export { QueryBuilder };
export type { PublicAPI as QueryBuilderAPI, QueryBuilderProps };
