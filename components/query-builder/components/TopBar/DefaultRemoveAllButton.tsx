export type DefaultRemoveAllButtonProps = {
  onRemoveAll: () => void;
  className?: string;
};

export const DefaultRemoveAllButton = ({
  className,
  onRemoveAll,
}: DefaultRemoveAllButtonProps) => {
  return (
    <button className={className} onClick={onRemoveAll}>
      Remove All
    </button>
  );
};
