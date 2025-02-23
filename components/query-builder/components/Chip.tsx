import React, { useContext } from "react";
import { GlobalContext, GlobalContextValue } from "../contexts";
import { X } from "lucide-react";
import { cn } from "../utils";
import { ClassNames } from "../types";
import { useChip } from "../hooks";

type ChipRendererProps = {
  classNames: ClassNames;
  column: string;
  comparator?: string;
  value?: string;
  onDelete?: () => void;
  isInProgress?: boolean;
  allowDelete?: boolean;
} & React.ComponentPropsWithRef<"button">;

const Skeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn("h-2 rounded-md bg-muted bg-slate-300", className)}
      {...props}
    />
  );
};

export type ChipRenderer = (props: ChipRendererProps) => React.JSX.Element;

export const DefaultChip: ChipRenderer = ({
  column,
  comparator,
  value,
  onDelete,
  isInProgress = false,
  allowDelete = false,
  classNames,
  ...props
}: ChipRendererProps) => {
  return (
    <button
      type="button"
      className={cn(
        "query-builder-chip inline-flex items-center rounded-full border px-2.5 py-2 mr-1 mb-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-1 focus:ring-ring focus:ring-offset-1",
        {
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80":
            !isInProgress,
          "text-foreground": isInProgress,
        },
        classNames.chip
      )}
      {...props}
    >
      {column}&nbsp;
      {comparator ? <i>{comparator}</i> : <Skeleton className="w-[50px]" />}
      &nbsp;
      {value ? (
        <code className="max-w-[300px] truncate">{value}</code>
      ) : (
        <Skeleton className="w-[24px]" />
      )}
      {onDelete && allowDelete && (
        <span onClick={onDelete} className="ml-1 focus:outline-none">
          <X size={14} />
        </span>
      )}
    </button>
  );
};

export type ChipProps = {
  index: number;
  render?: ChipRenderer;
};

export const Chip = ({ render = DefaultChip, index }: ChipProps) => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { classNames } = context;
  const useChipState = useChip(index);

  return render({
    classNames,
    ...useChipState,
  });
};
