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
} from 'react';

import { Props, ProviderRpcError } from '../types/types';
import { match } from '../utils/match';
import {
  forwardRefWithAs,
  render,
  Features,
  PropsForFeatures,
} from '../utils/render';
import { useSyncRefs } from '../hooks/use-sync-refs';
import { Keys } from '../utils/keyboard';
import { isDisabledReactIssue7711 } from '../utils/bugs';
import { useId } from '../hooks/use-id';
import {
  useFocusTrap,
  Features as FocusTrapFeatures,
} from '../hooks/use-focus-trap';
import { useInertOthers } from '../hooks/use-inert-others';
import { Portal } from '../components/portal/portal';
import { ForcePortalRoot } from '../internal/portal-force-root';
import { Description, useDescriptions } from './description/description';
import { useOpenClosed, State } from '../internal/open-closed';
import { useServerHandoffComplete } from '../hooks/use-server-handoff-complete';
import { StackProvider, StackMessage } from '../internal/stack-context';
import { useOutsideClick } from '../hooks/use-outside-click';
import { getOwnerDocument } from '../utils/owner';
import { useOwnerDocument } from '../hooks/use-owner';
import { useEventListener } from '../hooks/use-event-listener';
import { useResolveButtonType } from '../hooks/use-resolve-button-type';
import { useWeb3React } from '@web3-react/core';
import { injected, walletconnect } from '../connectors';

enum ConnectStates {
  Open,
  Closed,
}

enum WalletStates {
  NotConnected,
  Connecting,
  Connected,
  Waiting,
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
const reducers: {
  [P in ActionTypes]: (
    state: StateDefinition,
    action: Extract<Actions, { type: P }>,
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

const ConnectContext = createContext<
  | [
      {
        connectState: ConnectStates;
        close(): void;
        setTitleId(id: string | null): void;
      },
      StateDefinition,
      Dispatch<Actions>,
    ]
  | null
>(null);
ConnectContext.displayName = 'ConnectContext';

function useConnectContext(component: string) {
  const context = useContext(ConnectContext);
  if (context === null) {
    const err = new Error(
      `<${component} /> is missing a parent <Connect /> component.`,
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

const DEFAULT_CONNECT_TAG = 'div' as const;
interface ConnectRenderPropArg {
  open: boolean;
  connected: boolean;
  connecting: boolean;
  waiting: boolean;
}
type ConnectPropsWeControl =
  | 'id'
  | 'role'
  | 'aria-modal'
  | 'aria-describedby'
  | 'aria-labelledby'
  | 'onClick';

const ConnectRenderFeatures = Features.RenderStrategy | Features.Static;

const ConnectRoot = forwardRefWithAs(function Connect<
  TTag extends ElementType = typeof DEFAULT_CONNECT_TAG,
>(
  props: Props<TTag, ConnectRenderPropArg, ConnectPropsWeControl> &
    PropsForFeatures<typeof ConnectRenderFeatures> & {
      open?: boolean;
      onClose(value: boolean): void;
      initialFocus?: MutableRefObject<HTMLElement | null>;
      __demoMode?: boolean;
    },
  ref: Ref<HTMLDivElement>,
) {
  const { onClose, initialFocus, __demoMode = false, ...rest } = props;
  let { open } = props;
  const [nestedConnectCount, setNestedConnectCount] = useState(0);

  const usesOpenClosedState = useOpenClosed();
  if (open === undefined && usesOpenClosedState !== null) {
    // Update the `open` prop based on the open closed state
    open = match(usesOpenClosedState, {
      [State.Open]: true,
      [State.Closed]: false,
    });
  }

  const containers = useRef<Set<MutableRefObject<HTMLElement | null>>>(
    new Set(),
  );
  const internalConnectRef = useRef<HTMLDivElement | null>(null);
  const connectRef = useSyncRefs(internalConnectRef, ref);
  const buttonRef = useRef<StateDefinition['buttonRef']['current']>(null);

  const ownerDocument = useOwnerDocument(internalConnectRef);

  // Validations
  const hasOpen =
    Object.prototype.hasOwnProperty.call(props, 'open') ||
    usesOpenClosedState !== null;
  const hasOnClose = Object.prototype.hasOwnProperty.call(props, 'onClose');
  if (!hasOpen && !hasOnClose) {
    throw new Error(
      `You have to provide an \`open\` and an \`onClose\` prop to the \`Connect\` component.`,
    );
  }

  if (!hasOpen) {
    throw new Error(
      `You provided an \`onClose\` prop to the \`Connect\`, but forgot an \`open\` prop.`,
    );
  }

  if (!hasOnClose) {
    throw new Error(
      `You provided an \`open\` prop to the \`Connect\`, but forgot an \`onClose\` prop.`,
    );
  }

  if (typeof open !== 'boolean') {
    throw new Error(
      `You provided an \`open\` prop to the \`Connect\`, but the value is not a boolean. Received: ${open}`,
    );
  }

  if (typeof onClose !== 'function') {
    throw new Error(
      `You provided an \`onClose\` prop to the \`Connect\`, but the value is not a function. Received: ${onClose}`,
    );
  }

  const connectState = open ? ConnectStates.Open : ConnectStates.Closed;
  const visible = (() => {
    if (usesOpenClosedState !== null) {
      return usesOpenClosedState === State.Open;
    }

    return connectState === ConnectStates.Open;
  })();

  const [state, dispatch] = useReducer(stateReducer, {
    titleId: null,
    descriptionId: null,
    buttonRef,
    walletState: WalletStates.NotConnected,
  } as StateDefinition);

  const { active, account } = useWeb3React();

  const close = useCallback(() => onClose(false), [onClose]);

  const setTitleId = useCallback(
    (id: string | null) => dispatch({ type: ActionTypes.SetTitleId, id }),
    [dispatch],
  );

  const ready = useServerHandoffComplete();
  const enabled = ready
    ? __demoMode
      ? false
      : connectState === ConnectStates.Open
    : false;
  const hasNestedConnects = nestedConnectCount > 1; // 1 is the current Connect
  const hasParentConnect = useContext(ConnectContext) !== null;

  // If there are multiple connects, then you can be the root, the leaf or one
  // in between. We only care abou whether you are the top most one or not.
  const position = !hasNestedConnects ? 'leaf' : 'parent';

  useFocusTrap(
    internalConnectRef,
    enabled
      ? match(position, {
          parent: FocusTrapFeatures.RestoreFocus,
          leaf: FocusTrapFeatures.All & ~FocusTrapFeatures.FocusLock,
        })
      : FocusTrapFeatures.None,
    { initialFocus, containers },
  );
  useInertOthers(internalConnectRef, hasNestedConnects ? enabled : false);

  // Handle outside click
  useOutsideClick(internalConnectRef, () => {
    if (connectState !== ConnectStates.Open) return;
    if (hasNestedConnects) return;

    close();
  });

  // Handle `Escape` to close
  useEventListener(ownerDocument?.defaultView, 'keydown', (event) => {
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

    const ownerDocument = getOwnerDocument(internalConnectRef);
    if (!ownerDocument) return;

    const documentElement = ownerDocument.documentElement;
    const ownerWindow = ownerDocument.defaultView ?? window;

    const overflow = documentElement.style.overflow;
    const paddingRight = documentElement.style.paddingRight;

    const scrollbarWidth = ownerWindow.innerWidth - documentElement.clientWidth;

    documentElement.style.overflow = 'hidden';
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

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
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

  const [describedby, DescriptionProvider] = useDescriptions();

  const id = `piedao-Connect-${useId()}`;

  const contextBag = useMemo<ContextType<typeof ConnectContext>>(
    () => [{ connectState, close, setTitleId }, state, dispatch],
    [connectState, state, close, setTitleId],
  );

  const slot = useMemo<ConnectRenderPropArg>(
    () => ({
      open: connectState === ConnectStates.Open,
      connected: active && !!account,
      connecting: state.walletState === WalletStates.Connecting,
      waiting: state.walletState === WalletStates.Waiting,
    }),
    [connectState, state, active, account],
  );

  const propsWeControl = {
    ref: connectRef,
    id,
    role: 'Connect',
    'aria-modal': connectState === ConnectStates.Open ? true : undefined,
    'aria-labelledby': state.titleId,
    'aria-describedby': describedby,
    onClick(event: ReactMouseEvent) {
      event.stopPropagation();
    },
  };
  const passthroughProps = rest;

  return (
    <StackProvider
      type="Connect"
      element={internalConnectRef}
      onUpdate={useCallback((message, type, element) => {
        if (type !== 'Connect') return;

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
                    name: 'Connect',
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

const DEFAULT_OVERLAY_TAG = 'div' as const;
interface OverlayRenderPropArg {
  open: boolean;
}
type OverlayPropsWeControl = 'id' | 'aria-hidden' | 'onClick';

const Overlay = forwardRefWithAs(function Overlay<
  TTag extends ElementType = typeof DEFAULT_OVERLAY_TAG,
>(
  props: Props<TTag, OverlayRenderPropArg, OverlayPropsWeControl>,
  ref: Ref<HTMLDivElement>,
) {
  const [{ connectState, close }] = useConnectContext('Connect.Overlay');
  const overlayRef = useSyncRefs(ref);

  const id = `piedao-Connect-overlay-${useId()}`;

  const handleClick = useCallback(
    (event: ReactMouseEvent) => {
      if (event.target !== event.currentTarget) return;
      if (isDisabledReactIssue7711(event.currentTarget))
        return event.preventDefault();
      event.preventDefault();
      event.stopPropagation();
      close();
    },
    [close],
  );

  const slot = useMemo<OverlayRenderPropArg>(
    () => ({ open: connectState === ConnectStates.Open }),
    [connectState],
  );
  const propsWeControl = {
    ref: overlayRef,
    id,
    'aria-hidden': true,
    onClick: handleClick,
  };
  const passthroughProps = props;

  return render({
    props: { ...passthroughProps, ...propsWeControl },
    slot,
    defaultTag: DEFAULT_OVERLAY_TAG,
    name: 'Connect.Overlay',
  });
});

// ---

const DEFAULT_TITLE_TAG = 'h2' as const;
interface TitleRenderPropArg {
  open: boolean;
}
type TitlePropsWeControl = 'id';

const Title = forwardRefWithAs(function Title<
  TTag extends ElementType = typeof DEFAULT_TITLE_TAG,
>(
  props: Props<TTag, TitleRenderPropArg, TitlePropsWeControl>,
  ref: Ref<HTMLHeadingElement>,
) {
  const [{ connectState, setTitleId }] = useConnectContext('Connect.Title');

  const id = `piedao-Connect-title-${useId()}`;
  const titleRef = useSyncRefs(ref);

  useEffect(() => {
    setTitleId(id);
    return () => setTitleId(null);
  }, [id, setTitleId]);

  const slot = useMemo<TitleRenderPropArg>(
    () => ({ open: connectState === ConnectStates.Open }),
    [connectState],
  );
  const propsWeControl = { id };
  const passthroughProps = props;

  return render({
    props: { ref: titleRef, ...passthroughProps, ...propsWeControl },
    slot,
    defaultTag: DEFAULT_TITLE_TAG,
    name: 'Connect.Title',
  });
});

// ---

// ---

const DEFAULT_METAMASKBUTTON_TAG = 'button' as const;

interface MetamaskButtonRenderPropArg {
  connected: boolean;
}

type MetamaskButtonPropsWeControl =
  | 'id'
  | 'type'
  | 'aria-expanded'
  | 'onKeyDown'
  | 'onClick';

const MetamaskButton = forwardRefWithAs(function Button<
  TTag extends ElementType = typeof DEFAULT_METAMASKBUTTON_TAG,
>(
  props: Props<TTag, MetamaskButtonRenderPropArg, MetamaskButtonPropsWeControl>,
  ref: Ref<HTMLButtonElement>,
) {
  const [{ connectState, close }, stateDefinition, dispatch] =
    useConnectContext('Connect.MetamaskButton');
  const { active, activate, account } = useWeb3React();
  const internalButtonRef = useRef<HTMLButtonElement | null>(null);
  const buttonRef = useSyncRefs(
    internalButtonRef,
    ref,
    stateDefinition.buttonRef,
  );

  const handleKeyDown = useCallback(
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
          } catch (e: unknown) {
            const error = e as ProviderRpcError;
            console.error(error);
            if (error.code === -32002) {
              dispatch({
                type: ActionTypes.SetWalletState,
                walletState: WalletStates.Waiting,
              });
            } else {
              dispatch({
                type: ActionTypes.SetWalletState,
                walletState: WalletStates.NotConnected,
              });
            }
          }
          break;
      }
    },
    [activate, close, dispatch],
  );

  const handleKeyUp = useCallback(
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
    [],
  );

  const slot = useMemo<MetamaskButtonRenderPropArg>(
    () => ({
      connected: active && !!account,
    }),
    [active, account],
  );

  const handleClick = useCallback(
    async (event: ReactMouseEvent) => {
      if (isDisabledReactIssue7711(event.currentTarget)) return;
      if (props['disabled']) return;
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
      } catch (e: unknown) {
        const error = e as ProviderRpcError;
        console.error(error);
        if (error.code === -32002) {
          dispatch({
            type: ActionTypes.SetWalletState,
            walletState: WalletStates.Waiting,
          });
        } else {
          dispatch({
            type: ActionTypes.SetWalletState,
            walletState: WalletStates.NotConnected,
          });
        }
      }
    },
    [activate, close, dispatch, props],
  );

  const type = useResolveButtonType(props, internalButtonRef);
  const passthroughProps = props;
  const propsWeControl = {
    ref: buttonRef,
    id: 'piedao-metamask-connect-button',
    type,
    'aria-expanded': props['disabled']
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
    name: 'Connect.MetamaskButton',
  });
});

// ---

// ---

const DEFAULT_WALLETCONNECTBUTTON_TAG = 'button' as const;

interface WalletConnectButtonRenderPropArg {
  connected: boolean;
}

type WalletConnectButtonPropsWeControl =
  | 'id'
  | 'type'
  | 'aria-expanded'
  | 'onKeyDown'
  | 'onClick';

const WalletConnectButton = forwardRefWithAs(function Button<
  TTag extends ElementType = typeof DEFAULT_WALLETCONNECTBUTTON_TAG,
>(
  props: Props<
    TTag,
    WalletConnectButtonRenderPropArg,
    WalletConnectButtonPropsWeControl
  >,
  ref: Ref<HTMLButtonElement>,
) {
  const [{ connectState, close }, stateDefinition, dispatch] =
    useConnectContext('Connect.WalletConnectButton');
  const { active, activate, account } = useWeb3React();
  const internalButtonRef = useRef<HTMLButtonElement | null>(null);
  const buttonRef = useSyncRefs(
    internalButtonRef,
    ref,
    stateDefinition.buttonRef,
  );

  const handleKeyDown = useCallback(
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
          } catch (e: unknown) {
            const error = e as ProviderRpcError;
            console.error(error);
            if (error.code === -32002) {
              dispatch({
                type: ActionTypes.SetWalletState,
                walletState: WalletStates.Waiting,
              });
            } else {
              dispatch({
                type: ActionTypes.SetWalletState,
                walletState: WalletStates.NotConnected,
              });
            }
          }
          break;
      }
    },
    [activate, close, dispatch],
  );

  const handleKeyUp = useCallback(
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
    [],
  );

  const slot = useMemo<WalletConnectButtonRenderPropArg>(
    () => ({
      connected: active && !!account,
    }),
    [account, active],
  );

  const handleClick = useCallback(
    async (event: ReactMouseEvent) => {
      if (isDisabledReactIssue7711(event.currentTarget)) return;
      if (props['disabled']) return;
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
      } catch (e: unknown) {
        const error = e as ProviderRpcError;
        console.error(error);
        if (error.code === -32002) {
          dispatch({
            type: ActionTypes.SetWalletState,
            walletState: WalletStates.Waiting,
          });
        } else {
          dispatch({
            type: ActionTypes.SetWalletState,
            walletState: WalletStates.NotConnected,
          });
        }
      }
    },
    [activate, close, dispatch, props],
  );

  const type = useResolveButtonType(props, internalButtonRef);
  const passthroughProps = props;
  const propsWeControl = {
    ref: buttonRef,
    id: 'piedao-walletconnect-connect-button',
    type,
    'aria-expanded': props['disabled']
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
    name: 'Connect.WalletConnectButton',
  });
});

// ---

const DEFAULT_DISCONNECTBUTTON_TAG = 'button' as const;

interface DisconnectButtonRenderPropArg {
  connected: boolean;
}

type DisconnectButtonPropsWeControl =
  | 'id'
  | 'type'
  | 'aria-expanded'
  | 'onKeyDown'
  | 'onClick';

const DisconnectButton = forwardRefWithAs(function Button<
  TTag extends ElementType = typeof DEFAULT_DISCONNECTBUTTON_TAG,
>(
  props: Props<
    TTag,
    DisconnectButtonRenderPropArg,
    DisconnectButtonPropsWeControl
  >,
  ref: Ref<HTMLButtonElement>,
) {
  const [{ connectState, close }, stateDefinition, dispatch] =
    useConnectContext('Connect.DisconnectButton');
  const { active, account, deactivate } = useWeb3React();
  const internalButtonRef = useRef<HTMLButtonElement | null>(null);
  const buttonRef = useSyncRefs(
    internalButtonRef,
    ref,
    stateDefinition.buttonRef,
  );

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        case Keys.Space:
        case Keys.Enter:
          event.preventDefault();
          event.stopPropagation();
          try {
            deactivate();
            dispatch({
              type: ActionTypes.SetWalletState,
              walletState: WalletStates.NotConnected,
            });
            close();
          } catch (e) {
            console.error(e);
          }
          break;
      }
    },
    [close, deactivate, dispatch],
  );

  const handleKeyUp = useCallback(
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
    [],
  );

  const slot = useMemo<MetamaskButtonRenderPropArg>(
    () => ({
      connected: active && !!account,
    }),
    [active, account],
  );

  const handleClick = useCallback(
    (event: ReactMouseEvent) => {
      if (isDisabledReactIssue7711(event.currentTarget)) return;
      if (props['disabled']) return;
      try {
        deactivate();
        dispatch({
          type: ActionTypes.SetWalletState,
          walletState: WalletStates.NotConnected,
        });
        close();
      } catch (e) {
        console.error(e);
      }
    },
    [close, deactivate, dispatch, props],
  );

  const type = useResolveButtonType(props, internalButtonRef);
  const passthroughProps = props;
  const propsWeControl = {
    ref: buttonRef,
    id: 'piedao-disconnect-button',
    type,
    'aria-expanded': props['disabled']
      ? undefined
      : connectState === ConnectStates.Open,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onClick: handleClick,
  };

  return render({
    props: { ...passthroughProps, ...propsWeControl },
    slot,
    defaultTag: DEFAULT_DISCONNECTBUTTON_TAG,
    name: 'Connect.DisconnectButton',
  });
});

// ---

export const Connect = Object.assign(ConnectRoot, {
  Overlay,
  Title,
  Description,
  MetamaskButton,
  WalletConnectButton,
  DisconnectButton,
});
