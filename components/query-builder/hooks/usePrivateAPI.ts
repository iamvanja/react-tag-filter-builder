import { useEffect, useRef, useState } from "react";
import { Column, QueryPart, Step } from "../types";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { getFieldsPerStep, getPropsPerStep } from "../utils";

export type PrivateAPIState = {
  inputValue: string;
  currentColumn: Column | null;
  currentStep: Step;
  currentQueryPart: Partial<QueryPart>;
  queryParts: QueryPart[];
  focusedChipIndex: number;
  editedChipIndex: number | null;
  isInputFocused: boolean;
  suggestions: string[];
  focusedSuggestionIndex: number;
};

export type PrivateAPI = {
  setInputValue: (value: string) => void;
  setCurrentColumn: (column: PrivateAPIState["currentColumn"]) => void;
  setCurrentStep: (step: Step) => void;
  setCurrentQueryPart: (queryPart: Partial<QueryPart>) => void;
  setQueryParts: (queryParts: QueryPart[]) => void;
  setFocusedChipIndex: (chipIndex: number) => void;
  setEditedChipIndex: (chipIndex: number | null) => void;
  onSelectionChange: (suggestion: string) => void;
  inputPropsPerStep: () => {
    placeholder: string;
    allowNoMatchSelection?: boolean;
    type?: string;
  };
  setInputFocused: (isFocused: boolean) => void;
  setSuggestions: (suggestions: string[]) => void;
  updateSuggestions: (value?: string) => void;
  setFocusedSuggestionIndex: React.Dispatch<React.SetStateAction<number>>;
  handleGoBack: () => void;
};

export type UsePrivateAPIState = PrivateAPI & {
  state: PrivateAPIState;
};

export type PrivateAPIProps = {
  columns: Column[];
  initialFilter: QueryPart[];
  shouldPersistData: boolean;
  localStorageKey: string;
  onFilterChange?: (queryParts: QueryPart[]) => void;
};

const usePrivateAPI = ({
  columns,
  initialFilter,
  shouldPersistData,
  localStorageKey,
  onFilterChange,
}: PrivateAPIProps): React.RefObject<UsePrivateAPIState> => {
  const ref = useRef<UsePrivateAPIState>(null!);
  const [inputValue, setInputValue] = useState("");
  const [currentColumn, setCurrentColumn] =
    useState<PrivateAPIState["currentColumn"]>(null);
  const [currentStep, setCurrentStep] = useState<Step>(Step.column);
  const [currentQueryPart, setCurrentQueryPart] = useState<
    PrivateAPIState["currentQueryPart"]
  >({});
  const [storedValue, setStoredValue] = useLocalStorage(
    localStorageKey,
    initialFilter
  );
  const [queryParts, _setQueryParts] = useState<QueryPart[]>(initialFilter);
  const [focusedChipIndex, setFocusedChipIndex] = useState(-1);
  const [editedChipIndex, setEditedChipIndex] =
    useState<PrivateAPIState["editedChipIndex"]>(null);
  const [isInputFocused, setInputFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>(
    getFieldsPerStep(currentStep, columns, currentColumn)
  );
  // todo: remove fields
  const fields = getFieldsPerStep(currentStep, columns, currentColumn);
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);

  // Set initial state if persisting data from localStorage. Using useEffect because to avoid the SSR hydration issues
  useEffect(() => {
    if (shouldPersistData) {
      _setQueryParts(storedValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSuggestions(getFieldsPerStep(currentStep, columns, currentColumn));
    setFocusedSuggestionIndex(-1);
  }, [currentStep, columns, currentColumn]);

  const state: PrivateAPIState = {
    inputValue,
    currentColumn,
    currentStep,
    currentQueryPart,
    queryParts,
    focusedChipIndex,
    editedChipIndex,
    isInputFocused,
    suggestions,
    focusedSuggestionIndex,
  };

  const setQueryParts = (queryParts: QueryPart[]) => {
    console.log("set query parts", queryParts);
    _setQueryParts(queryParts);

    if (onFilterChange) {
      onFilterChange(queryParts);
    }

    if (shouldPersistData) {
      setStoredValue(queryParts);
    }
  };

  const onSelectionChange = (suggestion: string) => {
    const currentQP = currentQueryPart;

    if (currentStep === Step.column) {
      setCurrentQueryPart({
        ...currentQP,
        column: suggestion,
      });
      setCurrentColumn(columns.find((col) => col.name === suggestion) ?? null);
      setCurrentStep(Step.comparator);
    } else if (currentStep === Step.comparator) {
      setCurrentQueryPart({
        ...currentQP,
        comparator: suggestion,
      });
      setCurrentStep(Step.value);
    } else if (currentStep === Step.value) {
      if (currentQP.column && currentQP.comparator && suggestion) {
        if (editedChipIndex !== null) {
          // Update existing query part
          setQueryParts(
            queryParts.map((part, index) =>
              index === editedChipIndex
                ? { ...(currentQP as QueryPart), value: suggestion }
                : part
            )
          );
          setEditedChipIndex(null);
        } else {
          // Add new query part
          setQueryParts([
            ...queryParts,
            { ...(currentQP as QueryPart), value: suggestion },
          ]);
        }

        setCurrentQueryPart({});
        setCurrentStep(Step.column);
      }
    }

    setInputValue("");
  };

  const handleGoBack = () => {
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
  };

  const api: PrivateAPI = {
    setInputValue,
    setCurrentColumn,
    setCurrentStep,
    setCurrentQueryPart,
    setQueryParts,
    setFocusedChipIndex,
    setEditedChipIndex,
    onSelectionChange,
    inputPropsPerStep: () => getPropsPerStep(currentStep, currentColumn),
    setInputFocused,
    setSuggestions,
    updateSuggestions: (value) => {
      const filteredSuggestions: string[] =
        value && value.length > 0
          ? fields.filter((col) =>
              col.toLowerCase().includes(value.toLowerCase())
            )
          : fields;

      setSuggestions(filteredSuggestions);
    },
    setFocusedSuggestionIndex,
    handleGoBack,
  };

  ref.current = { ...api, state };

  return ref;
};

export { usePrivateAPI };
