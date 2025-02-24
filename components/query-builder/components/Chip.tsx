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
  return <div className={cn(className)} {...props} />;
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
      className={cn(classNames.chip, {
        [classNames.chipInProgress ?? ""]: isInProgress,
      })}
      {...props}
    >
      <span className={classNames.chipColumn}>{column}</span>&nbsp;
      {comparator ? (
        <i className={classNames.chipComparator}>{comparator}</i>
      ) : (
        <Skeleton
          className={cn(
            classNames.chipSkeleton,
            classNames.chipSkeletonComparator
          )}
        />
      )}
      &nbsp;
      {value ? (
        <code className={classNames.chipValue}>{value}</code>
      ) : (
        <Skeleton
          className={cn(classNames.chipSkeleton, classNames.chipSkeletonValue)}
        />
      )}
      {onDelete && allowDelete && (
        <span onClick={onDelete} className={classNames.chipDelete}>
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
