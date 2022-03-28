// WAI-ARIA: https://www.w3.org/TR/wai-aria-practices-1.2/#connect_modal
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,

  // Types
  Dispatch,
  ContextType,
  ElementType,
  MouseEvent as ReactMouseEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MutableRefObject,
  Ref,
} from "react";

import { Props } from "../types/types";
import { match } from "../utils/match";
import {
  forwardRefWithAs,
  render,
  Features,
  PropsForFeatures,
} from "../utils/render";
import { useSyncRefs } from "../hooks/use-sync-refs";
import { Keys } from "../utils/keyboard";
import { isDisabledReactIssue7711 } from "../utils/bugs";
import { useId } from "../hooks/use-id";
import {
  useFocusTrap,
  Features as FocusTrapFeatures,
} from "../hooks/use-focus-trap";
import { useInertOthers } from "../hooks/use-inert-others";
import { Portal } from "../components/portal/portal";
import { ForcePortalRoot } from "../internal/portal-force-root";
import { Description, useDescriptions } from "./description/description";
import { useOpenClosed, State } from "../internal/open-closed";
import { useServerHandoffComplete } from "../hooks/use-server-handoff-complete";
import { StackProvider, StackMessage } from "../internal/stack-context";
import { useOutsideClick } from "../hooks/use-outside-click";
import { getOwnerDocument } from "../utils/owner";
import { useOwnerDocument } from "../hooks/use-owner";
import { useEventListener } from "../hooks/use-event-listener";
import { useResolveButtonType } from "../hooks/use-resolve-button-type";
import { useWeb3React } from "@web3-react/core";
import { injected, walletconnect } from "../connectors";

enum ConnectStates {
  Open,
  Closed,
}

enum WalletStates {
  NotConnected,
  Connecting,
  Connected,
}

interface StateDefinition {
  titleId: string | null;
  buttonRef: MutableRefObject<HTMLButtonElement | null>;
  walletState: WalletStates;
}

enum ActionTypes {
  SetTitleId,
  SetWalletState,
}

type Actions =
  | { type: ActionTypes.SetTitleId; id: string | null }
  | { type: ActionTypes.SetWalletState; walletState: WalletStates };
let reducers: {
  [P in ActionTypes]: (
    state: StateDefinition,
    action: Extract<Actions, { type: P }>
  ) => StateDefinition;
} = {
  [ActionTypes.SetTitleId](state, action) {
    if (state.titleId === action.id) return state;
    return { ...state, titleId: action.id };
  },
  [ActionTypes.SetWalletState](state, action) {
    if (state.walletState === action.walletState) return state;
    return { ...state, walletState: action.walletState };
  },
};

let ConnectContext =
  createContext<
    | [
        {
          connectState: ConnectStates;
          close(): void;
          setTitleId(id: string | null): void;
        },
        StateDefinition,
        Dispatch<Actions>
      ]
    | null
  >(null);
ConnectContext.displayName = "ConnectContext";

function useConnectContext(component: string) {
  let context = useContext(ConnectContext);
  if (context === null) {
    let err = new Error(
      `<${component} /> is missing a parent <Connect /> component.`
    );
    if (Error.captureStackTrace)
      Error.captureStackTrace(err, useConnectContext);
    throw err;
  }
  return context;
}

function stateReducer(state: StateDefinition, action: Actions) {
  return match(action.type, reducers, state, action);
}

// ---

let DEFAULT_CONNECT_TAG = "div" as const;
interface ConnectRenderPropArg {
  open: boolean;
  connected: boolean;
}
type ConnectPropsWeControl =
  | "id"
  | "role"
  | "aria-modal"
  | "aria-describedby"
  | "aria-labelledby"
  | "onClick";

let ConnectRenderFeatures = Features.RenderStrategy | Features.Static;

let ConnectRoot = forwardRefWithAs(function Connect<
  TTag extends ElementType = typeof DEFAULT_CONNECT_TAG
>(
  props: Props<TTag, ConnectRenderPropArg, ConnectPropsWeControl> &
    PropsForFeatures<typeof ConnectRenderFeatures> & {
      open?: boolean;
      onClose(value: boolean): void;
      initialFocus?: MutableRefObject<HTMLElement | null>;
      __demoMode?: boolean;
    },
  ref: Ref<HTMLDivElement>
) {
  let { open, onClose, initialFocus, __demoMode = false, ...rest } = props;
  let [nestedConnectCount, setNestedConnectCount] = useState(0);

  let usesOpenClosedState = useOpenClosed();
  if (open === undefined && usesOpenClosedState !== null) {
    // Update the `open` prop based on the open closed state
    open = match(usesOpenClosedState, {
      [State.Open]: true,
      [State.Closed]: false,
    });
  }

  let containers = useRef<Set<MutableRefObject<HTMLElement | null>>>(new Set());
  let internalConnectRef = useRef<HTMLDivElement | null>(null);
  let connectRef = useSyncRefs(internalConnectRef, ref);
  let buttonRef = useRef<StateDefinition["buttonRef"]["current"]>(null);

  let ownerDocument = useOwnerDocument(internalConnectRef);

  // Validations
  let hasOpen = props.hasOwnProperty("open") || usesOpenClosedState !== null;
  let hasOnClose = props.hasOwnProperty("onClose");
  if (!hasOpen && !hasOnClose) {
    throw new Error(
      `You have to provide an \`open\` and an \`onClose\` prop to the \`Connect\` component.`
    );
  }

  if (!hasOpen) {
    throw new Error(
      `You provided an \`onClose\` prop to the \`Connect\`, but forgot an \`open\` prop.`
    );
  }

  if (!hasOnClose) {
    throw new Error(
      `You provided an \`open\` prop to the \`Connect\`, but forgot an \`onClose\` prop.`
    );
  }

  if (typeof open !== "boolean") {
    throw new Error(
      `You provided an \`open\` prop to the \`Connect\`, but the value is not a boolean. Received: ${open}`
    );
  }

  if (typeof onClose !== "function") {
    throw new Error(
      `You provided an \`onClose\` prop to the \`Connect\`, but the value is not a function. Received: ${onClose}`
    );
  }

  let connectState = open ? ConnectStates.Open : ConnectStates.Closed;
  let visible = (() => {
    if (usesOpenClosedState !== null) {
      return usesOpenClosedState === State.Open;
    }

    return connectState === ConnectStates.Open;
  })();

  let [state, dispatch] = useReducer(stateReducer, {
    titleId: null,
    descriptionId: null,
    buttonRef,
    walletState: WalletStates.NotConnected,
  } as StateDefinition);

  const { active, account } = useWeb3React();

  let close = useCallback(() => onClose(false), [onClose]);

  let setTitleId = useCallback(
    (id: string | null) => dispatch({ type: ActionTypes.SetTitleId, id }),
    [dispatch]
  );

  let ready = useServerHandoffComplete();
  let enabled = ready
    ? __demoMode
      ? false
      : connectState === ConnectStates.Open
    : false;
  let hasNestedConnects = nestedConnectCount > 1; // 1 is the current Connect
  let hasParentConnect = useContext(ConnectContext) !== null;

  // If there are multiple connects, then you can be the root, the leaf or one
  // in between. We only care abou whether you are the top most one or not.
  let position = !hasNestedConnects ? "leaf" : "parent";

  useFocusTrap(
    internalConnectRef,
    enabled
      ? match(position, {
          parent: FocusTrapFeatures.RestoreFocus,
          leaf: FocusTrapFeatures.All & ~FocusTrapFeatures.FocusLock,
        })
      : FocusTrapFeatures.None,
    { initialFocus, containers }
  );
  useInertOthers(internalConnectRef, hasNestedConnects ? enabled : false);

  // Handle outside click
  useOutsideClick(internalConnectRef, () => {
    if (connectState !== ConnectStates.Open) return;
    if (hasNestedConnects) return;

    close();
  });

  // Handle `Escape` to close
  useEventListener(ownerDocument?.defaultView, "keydown", (event) => {
    if (event.key !== Keys.Escape) return;
    if (connectState !== ConnectStates.Open) return;
    if (hasNestedConnects) return;
    event.preventDefault();
    event.stopPropagation();
    close();
  });

  // Scroll lock
  useEffect(() => {
    if (connectState !== ConnectStates.Open) return;
    if (hasParentConnect) return;

    let ownerDocument = getOwnerDocument(internalConnectRef);
    if (!ownerDocument) return;

    let documentElement = ownerDocument.documentElement;
    let ownerWindow = ownerDocument.defaultView ?? window;

    let overflow = documentElement.style.overflow;
    let paddingRight = documentElement.style.paddingRight;

    let scrollbarWidth = ownerWindow.innerWidth - documentElement.clientWidth;

    documentElement.style.overflow = "hidden";
    documentElement.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      documentElement.style.overflow = overflow;
      documentElement.style.paddingRight = paddingRight;
    };
  }, [connectState, hasParentConnect]);

  // Trigger close when the FocusTrap gets hidden
  useEffect(() => {
    if (connectState !== ConnectStates.Open) return;
    if (!internalConnectRef.current) return;

    let observer = new IntersectionObserver((entries) => {
      for (let entry of entries) {
        if (
          entry.boundingClientRect.x === 0 &&
          entry.boundingClientRect.y === 0 &&
          entry.boundingClientRect.width === 0 &&
          entry.boundingClientRect.height === 0
        ) {
          close();
        }
      }
    });

    observer.observe(internalConnectRef.current);

    return () => observer.disconnect();
  }, [connectState, internalConnectRef, close]);

  let [describedby, DescriptionProvider] = useDescriptions();

  let id = `piedao-Connect-${useId()}`;

  let contextBag = useMemo<ContextType<typeof ConnectContext>>(
    () => [{ connectState, close, setTitleId }, state, dispatch],
    [connectState, state, close, setTitleId]
  );

  let slot = useMemo<ConnectRenderPropArg>(
    () => ({
      open: connectState === ConnectStates.Open,
      connected: active && !!account,
    }),
    [connectState]
  );

  let propsWeControl = {
    ref: connectRef,
    id,
    role: "Connect",
    "aria-modal": connectState === ConnectStates.Open ? true : undefined,
    "aria-labelledby": state.titleId,
    "aria-describedby": describedby,
    onClick(event: ReactMouseEvent) {
      event.stopPropagation();
    },
  };
  let passthroughProps = rest;

  return (
    <StackProvider
      type="Connect"
      element={internalConnectRef}
      onUpdate={useCallback((message, type, element) => {
        if (type !== "Connect") return;

        match(message, {
          [StackMessage.Add]() {
            containers.current.add(element);
            setNestedConnectCount((count) => count + 1);
          },
          [StackMessage.Remove]() {
            containers.current.add(element);
            setNestedConnectCount((count) => count - 1);
          },
        });
      }, [])}
    >
      <ForcePortalRoot force={true}>
        <Portal>
          <ConnectContext.Provider value={contextBag}>
            <Portal.Group target={internalConnectRef}>
              <ForcePortalRoot force={false}>
                <DescriptionProvider slot={slot} name="Connect.Description">
                  {render({
                    props: { ...passthroughProps, ...propsWeControl },
                    slot,
                    defaultTag: DEFAULT_CONNECT_TAG,
                    features: ConnectRenderFeatures,
                    visible,
                    name: "Connect",
                  })}
                </DescriptionProvider>
              </ForcePortalRoot>
            </Portal.Group>
          </ConnectContext.Provider>
        </Portal>
      </ForcePortalRoot>
    </StackProvider>
  );
});

// ---

let DEFAULT_OVERLAY_TAG = "div" as const;
interface OverlayRenderPropArg {
  open: boolean;
}
type OverlayPropsWeControl = "id" | "aria-hidden" | "onClick";

let Overlay = forwardRefWithAs(function Overlay<
  TTag extends ElementType = typeof DEFAULT_OVERLAY_TAG
>(
  props: Props<TTag, OverlayRenderPropArg, OverlayPropsWeControl>,
  ref: Ref<HTMLDivElement>
) {
  let [{ connectState, close }] = useConnectContext("Connect.Overlay");
  let overlayRef = useSyncRefs(ref);

  let id = `piedao-Connect-overlay-${useId()}`;

  let handleClick = useCallback(
    (event: ReactMouseEvent) => {
      if (event.target !== event.currentTarget) return;
      if (isDisabledReactIssue7711(event.currentTarget))
        return event.preventDefault();
      event.preventDefault();
      event.stopPropagation();
      close();
    },
    [close]
  );

  let slot = useMemo<OverlayRenderPropArg>(
    () => ({ open: connectState === ConnectStates.Open }),
    [connectState]
  );
  let propsWeControl = {
    ref: overlayRef,
    id,
    "aria-hidden": true,
    onClick: handleClick,
  };
  let passthroughProps = props;

  return render({
    props: { ...passthroughProps, ...propsWeControl },
    slot,
    defaultTag: DEFAULT_OVERLAY_TAG,
    name: "Connect.Overlay",
  });
});

// ---

let DEFAULT_TITLE_TAG = "h2" as const;
interface TitleRenderPropArg {
  open: boolean;
}
type TitlePropsWeControl = "id";

let Title = forwardRefWithAs(function Title<
  TTag extends ElementType = typeof DEFAULT_TITLE_TAG
>(
  props: Props<TTag, TitleRenderPropArg, TitlePropsWeControl>,
  ref: Ref<HTMLHeadingElement>
) {
  let [{ connectState, setTitleId }] = useConnectContext("Connect.Title");

  let id = `piedao-Connect-title-${useId()}`;
  let titleRef = useSyncRefs(ref);

  useEffect(() => {
    setTitleId(id);
    return () => setTitleId(null);
  }, [id, setTitleId]);

  let slot = useMemo<TitleRenderPropArg>(
    () => ({ open: connectState === ConnectStates.Open }),
    [connectState]
  );
  let propsWeControl = { id };
  let passthroughProps = props;

  return render({
    props: { ref: titleRef, ...passthroughProps, ...propsWeControl },
    slot,
    defaultTag: DEFAULT_TITLE_TAG,
    name: "Connect.Title",
  });
});

// ---

// ---

let DEFAULT_METAMASKBUTTON_TAG = "button" as const;

interface MetamaskButtonRenderPropArg {
  connected: boolean;
  connecting: boolean;
}

type MetamaskButtonPropsWeControl =
  | "id"
  | "type"
  | "aria-expanded"
  | "onKeyDown"
  | "onClick";

let MetamaskButton = forwardRefWithAs(function Button<
  TTag extends ElementType = typeof DEFAULT_METAMASKBUTTON_TAG
>(
  props: Props<TTag, MetamaskButtonRenderPropArg, MetamaskButtonPropsWeControl>,
  ref: Ref<HTMLButtonElement>
) {
  let [{ connectState, close }, stateDefinition, dispatch] =
    useConnectContext("Connect.Button");
  const { active, activate, account } = useWeb3React();
  let internalButtonRef = useRef<HTMLButtonElement | null>(null);
  let buttonRef = useSyncRefs(
    internalButtonRef,
    ref,
    stateDefinition.buttonRef
  );

  let handleKeyDown = useCallback(
    async (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case Keys.Space:
        case Keys.Enter:
          event.preventDefault();
          event.stopPropagation();
          try {
            dispatch({
              type: ActionTypes.SetWalletState,
              walletState: WalletStates.Connecting,
            });
            await activate(injected, undefined, true);
            dispatch({
              type: ActionTypes.SetWalletState,
              walletState: WalletStates.Connected,
            });
            close();
          } catch (e) {
            console.error(e);
            dispatch({
              type: ActionTypes.SetWalletState,
              walletState: WalletStates.NotConnected,
            });
          }
          break;
      }
    },
    [dispatch]
  );

  let handleKeyUp = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case Keys.Space:
          // Required for firefox, event.preventDefault() in handleKeyDown for
          // the Space key doesn't cancel the handleKeyUp, which in turn
          // triggers a *click*.
          event.preventDefault();
          break;
      }
    },
    []
  );

  let slot = useMemo<MetamaskButtonRenderPropArg>(
    () => ({
      connected: active && !!account,
      connecting: stateDefinition.walletState === WalletStates.Connecting,
    }),
    [stateDefinition.walletState]
  );

  let handleClick = useCallback(
    async (event: ReactMouseEvent) => {
      if (isDisabledReactIssue7711(event.currentTarget)) return;
      if (props.disabled) return;
      try {
        dispatch({
          type: ActionTypes.SetWalletState,
          walletState: WalletStates.Connecting,
        });
        await activate(injected, undefined, true);
        dispatch({
          type: ActionTypes.SetWalletState,
          walletState: WalletStates.Connected,
        });
        close();
      } catch (e) {
        console.error(e);
        dispatch({
          type: ActionTypes.SetWalletState,
          walletState: WalletStates.NotConnected,
        });
      }
    },
    [dispatch, props.disabled, stateDefinition.buttonRef]
  );

  let type = useResolveButtonType(props, internalButtonRef);
  let passthroughProps = props;
  let propsWeControl = {
    ref: buttonRef,
    id: "piedao-connect-button",
    type,
    "aria-expanded": props.disabled
      ? undefined
      : connectState === ConnectStates.Open,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onClick: handleClick,
  };

  return render({
    props: { ...passthroughProps, ...propsWeControl },
    slot,
    defaultTag: DEFAULT_METAMASKBUTTON_TAG,
    name: "Connect.MetamaskButton",
  });
});

// ---

// ---

let DEFAULT_WALLETCONNECTBUTTON_TAG = "button" as const;

interface WalletConnectButtonRenderPropArg {
  connected: boolean;
  connecting: boolean;
}

type WalletConnectButtonPropsWeControl =
  | "id"
  | "type"
  | "aria-expanded"
  | "onKeyDown"
  | "onClick";

let WalletConnectButton = forwardRefWithAs(function Button<
  TTag extends ElementType = typeof DEFAULT_WALLETCONNECTBUTTON_TAG
>(
  props: Props<
    TTag,
    WalletConnectButtonRenderPropArg,
    WalletConnectButtonPropsWeControl
  >,
  ref: Ref<HTMLButtonElement>
) {
  let [{ connectState, close }, stateDefinition, dispatch] =
    useConnectContext("Connect.Button");
  const { active, activate, account } = useWeb3React();
  let internalButtonRef = useRef<HTMLButtonElement | null>(null);
  let buttonRef = useSyncRefs(
    internalButtonRef,
    ref,
    stateDefinition.buttonRef
  );

  let handleKeyDown = useCallback(
    async (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case Keys.Space:
        case Keys.Enter:
          event.preventDefault();
          event.stopPropagation();
          try {
            dispatch({
              type: ActionTypes.SetWalletState,
              walletState: WalletStates.Connecting,
            });
            await activate(walletconnect, undefined, true);
            dispatch({
              type: ActionTypes.SetWalletState,
              walletState: WalletStates.Connected,
            });
            close();
          } catch (e) {
            console.error(e);
            dispatch({
              type: ActionTypes.SetWalletState,
              walletState: WalletStates.NotConnected,
            });
          }
          break;
      }
    },
    [dispatch]
  );

  let handleKeyUp = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case Keys.Space:
          // Required for firefox, event.preventDefault() in handleKeyDown for
          // the Space key doesn't cancel the handleKeyUp, which in turn
          // triggers a *click*.
          event.preventDefault();
          break;
      }
    },
    []
  );

  let slot = useMemo<WalletConnectButtonRenderPropArg>(
    () => ({
      connected: active && !!account,
      connecting: stateDefinition.walletState === WalletStates.Connecting,
    }),
    [stateDefinition.walletState]
  );

  let handleClick = useCallback(
    async (event: ReactMouseEvent) => {
      if (isDisabledReactIssue7711(event.currentTarget)) return;
      if (props.disabled) return;
      try {
        dispatch({
          type: ActionTypes.SetWalletState,
          walletState: WalletStates.Connecting,
        });
        await activate(walletconnect, undefined, true);
        dispatch({
          type: ActionTypes.SetWalletState,
          walletState: WalletStates.Connected,
        });
        close();
      } catch (e) {
        console.error(e);
        dispatch({
          type: ActionTypes.SetWalletState,
          walletState: WalletStates.NotConnected,
        });
      }
    },
    [dispatch, props.disabled, stateDefinition.buttonRef]
  );

  let type = useResolveButtonType(props, internalButtonRef);
  let passthroughProps = props;
  let propsWeControl = {
    ref: buttonRef,
    id: "piedao-walletconnect-connect-button",
    type,
    "aria-expanded": props.disabled
      ? undefined
      : connectState === ConnectStates.Open,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onClick: handleClick,
  };

  return render({
    props: { ...passthroughProps, ...propsWeControl },
    slot,
    defaultTag: DEFAULT_WALLETCONNECTBUTTON_TAG,
    name: "Connect.WalletConnectButton",
  });
});

// ---

export let Connect = Object.assign(ConnectRoot, {
  Overlay,
  Title,
  Description,
  MetamaskButton,
  WalletConnectButton,
});
