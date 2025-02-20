import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import { AutoComplete } from "./Autocomplete";
import { Step, QueryPart, Column, ClassNames, PublicAPI } from "../types";
import { getPropsPerStep } from "../utils";
import { ChipRenderer } from "./Chip";
import { Button } from "./Button";
import { cn } from "../utils";

import { GlobalContext } from "../contexts";
import { usePrivateAPI } from "../hooks/usePrivateAPI";
import { Debug, DebugRenderer } from "./Debug";
import { TopBar, TopBarRenderer } from "./TopBar";
import { usePublicAPI } from "../hooks";
import { ChipList, ChipListRenderer } from "./ChipList";

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
    },
    ref?
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const chipRefs = useRef<HTMLButtonElement[]>([]);

    const privateAPIref = usePrivateAPI({
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      privateAPIref.current.setInputValue(value);
    };

    const handleSelectionChange = (suggestion: string) => {
      const currentQP = privateAPIref.current.state.currentQueryPart;

      if (privateAPIref.current.state.currentStep === Step.column) {
        privateAPIref.current.setCurrentQueryPart({
          ...currentQP,
          column: suggestion,
        });
        privateAPIref.current.setCurrentColumn(
          columns.find((col) => col.name === suggestion) ?? null
        );
        privateAPIref.current.setCurrentStep(Step.comparator);
      } else if (privateAPIref.current.state.currentStep === Step.comparator) {
        privateAPIref.current.setCurrentQueryPart({
          ...currentQP,
          comparator: suggestion,
        });
        privateAPIref.current.setCurrentStep(Step.value);
      } else if (privateAPIref.current.state.currentStep === Step.value) {
        if (currentQP.column && currentQP.comparator && suggestion) {
          const queryParts = privateAPIref.current.state.queryParts;

          if (privateAPIref.current.state.editedChipIndex !== null) {
            // Update existing query part
            privateAPIref.current.setQueryParts(
              queryParts.map((part, index) =>
                index === privateAPIref.current.state.editedChipIndex
                  ? { ...(currentQP as QueryPart), value: suggestion }
                  : part
              )
            );
            privateAPIref.current.setEditedChipIndex(null);
          } else {
            // Add new query part
            privateAPIref.current.setQueryParts([
              ...queryParts,
              { ...(currentQP as QueryPart), value: suggestion },
            ]);
          }

          privateAPIref.current.setCurrentQueryPart({});
          privateAPIref.current.setCurrentStep(Step.column);
        }
      }

      privateAPIref.current.setInputValue("");
      inputRef.current?.focus();
    };

    const handleGoBack = useCallback(() => {
      const { currentStep, currentQueryPart } = privateAPIref.current.state;
      const { setCurrentStep, setCurrentQueryPart, setInputValue } =
        privateAPIref.current;

      if (currentStep === Step.comparator) {
        setCurrentStep(Step.column);
        setCurrentQueryPart({
          ...currentQueryPart,
          column: undefined,
        });
      } else if (currentStep === Step.value) {
        setCurrentStep(Step.comparator);
        setCurrentQueryPart({
          ...currentQueryPart,
          comparator: undefined,
        });
      }
      setInputValue("");
    }, [privateAPIref]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (
          e.key === "Backspace" &&
          privateAPIref.current.state.inputValue === ""
        ) {
          e.preventDefault();
          handleGoBack();
        }
      },
      [handleGoBack, privateAPIref]
    );

    return (
      <GlobalContext.Provider
        value={{ inputRef, chipRefs, privateAPIref, classNames }}
      >
        <div className={cn("w-full", classNames.root)}>
          {isDebug && <Debug render={renderDebug} />}

          <TopBar render={renderTopBar} />

          {/* todo: MainRow component, handle focus/blur styling */}
          <div className="border rounded-md pl-1 pt-1">
            <ChipList render={renderChipList} renderItem={renderChip} />

            <div className="relative inline-block">
              <div className="relative flex-grow flex items-center gap-1 w-[300px]">
                {privateAPIref.current.state.currentStep !== Step.column && (
                  <Button
                    className="text-lg border"
                    variant="ghost"
                    size="icon"
                    onClick={handleGoBack}
                  >
                    &lsaquo; {/* <ChevronLeft className="h-4 w-4" /> */}
                  </Button>
                )}
                <AutoComplete
                  tabIndex={0}
                  value={privateAPIref.current.state.inputValue}
                  ref={inputRef}
                  onChange={handleInputChange}
                  onSelectionChange={handleSelectionChange}
                  rootClassName="max-w-[240px]"
                  onKeyDown={handleKeyDown}
                  {...getPropsPerStep(
                    privateAPIref.current.state.currentStep,
                    columns,
                    privateAPIref.current.state.currentColumn
                  )}
                />
                {privateAPIref.current.state.currentStep === "value" && (
                  <Button
                    className="px-7"
                    size="icon"
                    onClick={() =>
                      handleSelectionChange(
                        privateAPIref.current.state.inputValue
                      )
                    }
                  >
                    {privateAPIref.current.state.editedChipIndex !== null
                      ? "Update"
                      : "Add"}
                  </Button>
                )}
              </div>
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
