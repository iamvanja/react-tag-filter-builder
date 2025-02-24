export enum Step {
  column = "column",
  comparator = "comparator",
  value = "value",
}

export enum InputType {
  string = "string",
  number = "number",
  enum = "enum",
  boolean = "boolean",
  date = "date",
}

export type QueryPart = {
  column: string;
  comparator: string;
  value: string;
};

export type Column = {
  name: string;
  inputType?: InputType;
  options?: string[];
};

export type ClassNames = {
  root?: string;
  debug?: string;
  topBar?: string;
  helperText?: string;
  removeAllButton?: string;
  chipList?: string;
  chipListItem?: string;
  chipListItemEdited?: string;
  chip?: string;
  chipInProgress?: string;
  chipSkeleton?: string;
  chipSkeletonComparator?: string;
  chipSkeletonValue?: string;
  chipColumn?: string;
  chipComparator?: string;
  chipValue?: string;
  chipDelete?: string;

  inputRoot?: string;
  input?: string;
  inputBackButton?: string;
  inputOKButton?: string;
  inputBackButtonShown?: string;
  inputOKButtonShown?: string;

  dropdownList?: string;
  dropdownListItem?: string;
  dropdownListItemActive?: string;
};

export type PublicAPI = {
  input: {
    blur(): void;
    focus(): void;
  };
};
