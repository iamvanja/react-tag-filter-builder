import { useContext, useEffect } from "react";
import { GlobalContext, GlobalContextValue } from "../contexts";

export type useDropdownListState = {
  suggestions: string[];
} & React.ComponentPropsWithRef<"ul">;

export const useDropdownList = (): useDropdownListState => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { privateAPIref, inputRef, suggestionRefs, suggestionDropdownRef } =
    context;

  // Fixes keyboard dropdown selection not scrolling into view
  useEffect(() => {
    const { focusedSuggestionIndex } = privateAPIref.current.state;
    if (
      focusedSuggestionIndex >= 0 &&
      focusedSuggestionIndex < suggestionRefs.current.length
    ) {
      suggestionRefs.current[focusedSuggestionIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [
    privateAPIref,
    suggestionRefs,
    privateAPIref.current.state.focusedSuggestionIndex,
  ]);

  // Solves the problem of calling onBlur and mutating state causing LI's (dropdown item) onClick to not fire. https://github.com/facebook/react/issues/4210
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        suggestionDropdownRef.current &&
        !suggestionDropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        privateAPIref.current.setInputFocused(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    suggestions: privateAPIref.current.state.suggestions,
    ref: suggestionDropdownRef,
  };
};
