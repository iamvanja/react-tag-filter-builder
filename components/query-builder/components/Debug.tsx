import { useContext } from "react";
import { GlobalContext, GlobalContextValue } from "../contexts";

type DebugRendererProps = {
  state: object;
  className?: string;
};
export type DebugRenderer = (props: DebugRendererProps) => React.JSX.Element;

export const DefaultDebug: DebugRenderer = ({ state, className }) => {
  return <pre className={className}>{JSON.stringify(state, null, 2)}</pre>;
};

type DebugProps = {
  render?: DebugRenderer;
};
export const Debug = ({ render = DefaultDebug }: DebugProps) => {
  const context = useContext(GlobalContext) || ({} as GlobalContextValue);
  const { privateAPIref, classNames } = context;

  return render({
    state: privateAPIref.current.state,
    className: classNames.debug,
  });
};
