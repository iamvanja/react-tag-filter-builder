import React, { useContext, useMemo, useState } from "react";
import { GlobalContext, GlobalContextValue } from "../contexts";
import { ClassNames } from "../types";
import { cn } from "../utils";

type MainRowRendererProps = React.ComponentPropsWithRef<"div"> & {
  children: React.ReactNode;
  classNames: ClassNames;
  isActive: boolean;
};

export type MainRowRenderer = (
  props: MainRowRendererProps
) => React.JSX.Element;

export const DefaultMainRow: MainRowRenderer = ({
  children,
  classNames,
  isActive,
  ...rootProps
}) => {
  return (
    <div
      className={cn(classNames.mainRow, {
        [classNames.mainRowIsActive ?? ""]: isActive,
      })}
      {...rootProps}
    >
      {children}
    </div>
  );
};

export type MainRowProps = {
  children: React.ReactNode[];
  render?: MainRowRenderer;
};

export const MainRow = ({
  children,
  render = DefaultMainRow,
}: MainRowProps) => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { classNames, inputRef, mainRowRef } = context;
  const [isActive, setIsActive] = useState(false);

  const rootProps = useMemo(() => {
    return {
      onFocus: () => setIsActive(true),
      onBlur: () => {
        if (!mainRowRef.current?.contains(document.activeElement)) {
          setIsActive(false);
        }
      },
      onClick: () => {
        // Focus input when clicking on main row
        if (document.activeElement === mainRowRef.current) {
          inputRef.current?.focus();
        }
      },
      ref: mainRowRef,
      tabIndex: -1,
    };
  }, [inputRef, mainRowRef]);

  return render({
    children,
    classNames,
    isActive,
    ...rootProps,
  });
};
