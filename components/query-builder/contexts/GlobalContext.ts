import React from "react";
import { UsePrivateAPIState } from "../hooks";
import { ClassNames } from "../types";

export type GlobalContextValue = {
  privateAPIref: React.RefObject<UsePrivateAPIState>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  chipRefs: React.RefObject<HTMLButtonElement[]>;
  suggestionDropdownRef: React.RefObject<HTMLUListElement>;
  suggestionRefs: React.RefObject<(HTMLLIElement | null)[]>;
  classNames: ClassNames;
};

export const GlobalContext = React.createContext<
  GlobalContextValue | undefined
>(undefined);
