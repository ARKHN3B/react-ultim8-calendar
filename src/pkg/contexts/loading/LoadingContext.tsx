/** Description: Loading Context is a simple state context based on hooks */
import React, {useEffect, useState} from "react";

/**
 * Types
 */
type State = boolean | null | undefined;
type Dispatch = ((loading: boolean) => void) | undefined;


/**
 * Contexts
 */
const LoadingStateContext    = React.createContext<State>(undefined);
const LoadingDispatchContext = React.createContext<Dispatch>(undefined);

/**
 * Interface for global provider
 */
interface ILoadingProvider {
  children?: React.ReactNode,
  initial?: State,
  controlledValue?: State | null,
}

/**
 * Global Provider
 * @param children
 * @param initial
 * @param {State} controlledValue - Used to control the state value manually
 * @constructor
 */
function LoadingProvider({children, initial, controlledValue}: ILoadingProvider): JSX.Element {
  const [loading, setLoading] = useState<State | null>(initial);

  useEffect(() => {
    if (typeof controlledValue !== "boolean") return; // ignore initial state (i.e. null)
    setLoading(controlledValue);
  }, [controlledValue]);

  return (
    <LoadingStateContext.Provider value={loading}>
      <LoadingDispatchContext.Provider value={setLoading}>
        {children}
      </LoadingDispatchContext.Provider>
    </LoadingStateContext.Provider>
  );
}

/**
 * State hook
 */
function useLoadingState(): State {
  const context: State = React.useContext(LoadingStateContext);
  if (context === undefined) {
    throw new Error("useLoadingState must be used within a LoadingProvider");
  }
  return context;
}


/**
 * Dispatch hook
 */
function useLoadingDispatch(): Dispatch {
  const context: Dispatch = React.useContext(LoadingDispatchContext);
  if (context === undefined) {
    throw new Error("useLoadingDispatch must be used within a LoadingProvider");
  }
  return context;
}


/**
 * Merge state and dispatch hooks
 */
function useLoading(): Array<any> {
  return [useLoadingState(), useLoadingDispatch()];
}


export {LoadingProvider, useLoading, useLoadingState};
