import React, { forwardRef, useEffect, useRef } from "react";
import { QueryPart, Column, ClassNames, PublicAPI } from "../types";
import { ChipRenderer } from "./Chip";
import { cn } from "../utils";

import { GlobalContext } from "../contexts";
import { usePrivateAPI } from "../hooks/usePrivateAPI";
import { Debug, DebugRenderer } from "./Debug";
import { TopBar, TopBarRenderer } from "./TopBar";
import { usePublicAPI } from "../hooks";
import { ChipList, ChipListRenderer } from "./ChipList";
import { Input, InputRenderer } from "./Input";
import { DropdownList, DropdownListRenderer } from "./DropdownList";
import { DropdownListItemRenderer } from "./DropdownListItem";

type QueryBuilderProps = {
  columns: Column[];
  isDebug?: boolean;
  classNames?: ClassNames;
  onFilterChange?: (queryParts: QueryPart[]) => void;
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
};
const LS_QUERY_PARTS_KEY = "filter";

const QueryBuilder = forwardRef<PublicAPI, QueryBuilderProps>(
  (
    {
      columns,
      isDebug = false,
      classNames = {},
      onFilterChange,
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
    },
    ref?
  ) => {
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
    });
    const publicAPI = usePublicAPI({ inputRef });

    if (ref) {
      if (typeof ref === "function") {
        ref(publicAPI);
      } else {
        ref.current = publicAPI;
      }
    }

    // todo: move
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

    return (
      <GlobalContext.Provider
        value={{
          inputRef,
          chipRefs,
          suggestionDropdownRef,
          suggestionRefs,
          privateAPIref,
          classNames,
        }}
      >
        <div className={cn("w-full", classNames.root)}>
          {isDebug && <Debug render={renderDebug} />}

          <TopBar render={renderTopBar} />

          {/* todo: MainRow component, handle focus/blur styling */}
          <div className="border rounded-md pl-1 pt-1">
            <ChipList render={renderChipList} renderItem={renderChip} />

            {/* todo: Combobox */}
            <div className="relative inline-block">
              <Input render={renderInput} />

              <DropdownList
                render={renderDropdownList}
                renderItem={renderDropdownListItem}
              />
            </div>
          </div>
        </div>
      </GlobalContext.Provider>
    );
  }
);

QueryBuilder.displayName = "QueryBuilder";

export { QueryBuilder };
export type { PublicAPI as QueryBuilderAPI, QueryBuilderProps };
