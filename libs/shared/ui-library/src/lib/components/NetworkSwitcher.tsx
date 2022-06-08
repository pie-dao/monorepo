import React, {
  Fragment,
  createContext,
  createRef,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  useRef,

  // Types
  Dispatch,
  ElementType,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  MutableRefObject,
  Ref,
  useEffect,
} from 'react';

import { useDisposables } from '../hooks/use-disposables';
import { useId } from '../hooks/use-id';
import { useIsoMorphicEffect } from '../hooks/use-iso-morphic-effect';
import { useComputed } from '../hooks/use-computed';
import { useSyncRefs } from '../hooks/use-sync-refs';
import { Props, NetworkDetail, ProviderRpcError } from '../types/types';
import {
  Features,
  forwardRefWithAs,
  PropsForFeatures,
  render,
  compact,
} from '../utils/render';
import { match } from '../utils/match';
import { disposables } from '../utils/disposables';
import { Keys } from '../utils/keyboard';
import { Focus, calculateActiveIndex } from '../utils/calculate-active-index';
import { isDisabledReactIssue7711 } from '../utils/bugs';
import {
  isFocusableElement,
  FocusableMode,
  sortByDomNode,
} from '../utils/focus-management';
import { useOpenClosed, State, OpenClosedProvider } from '../utils/open-closed';
import { useResolveButtonType } from '../hooks/use-resolve-button-type';
import { useOutsideClick } from '../hooks/use-outside-click';
import { VisuallyHidden } from '../internal/visually-hidden';
import { objectToFormEntries } from '../utils/form';
import { getOwnerDocument } from '../utils/owner';
import { changeNetwork, addNetwork } from '../utils/network';

enum NetworkSwitcherStates {
  Open,
  Closed,
}

enum ActivationTrigger {
  Pointer,
  Other,
}

type NetworkSwitcherOptionDataRef = MutableRefObject<{
  textValue?: string;
  disabled: boolean;
  value: NetworkDetail;
  domRef: MutableRefObject<HTMLElement | null>;
}>;

interface StateDefinition {
  networkSwitcherState: NetworkSwitcherStates;

  propsRef: MutableRefObject<{
    value: unknown;
    onChange: (value: unknown) => void;
  }>;
  labelRef: MutableRefObject<HTMLLabelElement | null>;
  buttonRef: MutableRefObject<HTMLButtonElement | null>;
  optionsRef: MutableRefObject<HTMLUListElement | null>;

  disabled: boolean;
  options: { id: string; dataRef: NetworkSwitcherOptionDataRef }[];
  activeOptionIndex: number | null;
  activationTrigger: ActivationTrigger;
}

enum ActionTypes {
  OpenNetworkSwitcher,
  CloseNetworkSwitcher,

  SetDisabled,

  GoToOption,

  RegisterOption,
  UnregisterOption,
}

function adjustOrderedState(
  state: StateDefinition,
  adjustment: (
    options: StateDefinition['options'],
  ) => StateDefinition['options'] = (i) => i,
) {
  const currentActiveOption =
    state.activeOptionIndex !== null
      ? state.options[state.activeOptionIndex]
      : null;

  const sortedOptions = sortByDomNode(
    adjustment(state.options.slice()),
    (option) => option.dataRef.current.domRef.current,
  );

  // If we inserted an option before the current active option then the active option index
  // would be wrong. To fix this, we will re-lookup the correct index.
  let adjustedActiveOptionIndex = currentActiveOption
    ? sortedOptions.indexOf(currentActiveOption)
    : null;

  // Reset to `null` in case the currentActiveOption was removed.
  if (adjustedActiveOptionIndex === -1) {
    adjustedActiveOptionIndex = null;
  }

  return {
    options: sortedOptions,
    activeOptionIndex: adjustedActiveOptionIndex,
  };
}

type Actions =
  | { type: ActionTypes.CloseNetworkSwitcher }
  | { type: ActionTypes.OpenNetworkSwitcher }
  | { type: ActionTypes.SetDisabled; disabled: boolean }
  | {
      type: ActionTypes.GoToOption;
      focus: Focus.Specific;
      id: string;
      trigger?: ActivationTrigger;
    }
  | {
      type: ActionTypes.GoToOption;
      focus: Exclude<Focus, Focus.Specific>;
      trigger?: ActivationTrigger;
    }
  | {
      type: ActionTypes.RegisterOption;
      id: string;
      dataRef: NetworkSwitcherOptionDataRef;
    }
  | { type: ActionTypes.UnregisterOption; id: string };

const reducers: {
  [P in ActionTypes]: (
    state: StateDefinition,
    action: Extract<Actions, { type: P }>,
  ) => StateDefinition;
} = {
  [ActionTypes.CloseNetworkSwitcher](state) {
    if (state.disabled) return state;
    if (state.networkSwitcherState === NetworkSwitcherStates.Closed)
      return state;
    return {
      ...state,
      activeOptionIndex: null,
      networkSwitcherState: NetworkSwitcherStates.Closed,
    };
  },
  [ActionTypes.OpenNetworkSwitcher](state) {
    if (state.disabled) return state;
    if (state.networkSwitcherState === NetworkSwitcherStates.Open) return state;
    return { ...state, networkSwitcherState: NetworkSwitcherStates.Open };
  },
  [ActionTypes.SetDisabled](state, action) {
    if (state.disabled === action.disabled) return state;
    return { ...state, disabled: action.disabled };
  },
  [ActionTypes.GoToOption](state, action) {
    if (state.disabled) return state;
    if (state.networkSwitcherState === NetworkSwitcherStates.Closed)
      return state;

    const adjustedState = adjustOrderedState(state);
    const activeOptionIndex = calculateActiveIndex(action, {
      resolveItems: () => adjustedState.options,
      resolveActiveIndex: () => adjustedState.activeOptionIndex,
      resolveId: (option) => option.id,
      resolveDisabled: (option) => option.dataRef.current.disabled,
    });

    return {
      ...state,
      ...adjustedState,
      activeOptionIndex,
      activationTrigger: action.trigger ?? ActivationTrigger.Other,
    };
  },
  [ActionTypes.RegisterOption]: (state, action) => {
    const adjustedState = adjustOrderedState(state, (options) => [
      ...options,
      { id: action.id, dataRef: action.dataRef },
    ]);

    return { ...state, ...adjustedState };
  },
  [ActionTypes.UnregisterOption]: (state, action) => {
    const adjustedState = adjustOrderedState(state, (options) => {
      const idx = options.findIndex((a) => a.id === action.id);
      if (idx !== -1) options.splice(idx, 1);
      return options;
    });

    return {
      ...state,
      ...adjustedState,
      activationTrigger: ActivationTrigger.Other,
    };
  },
};

const NetworkSwitcherContext = createContext<
  [StateDefinition, Dispatch<Actions>] | null
>(null);
NetworkSwitcherContext.displayName = 'NetworkSwitcherContext';

function useNetworkSwitcherContext(component: string) {
  const context = useContext(NetworkSwitcherContext);
  if (context === null) {
    const err = new Error(
      `<${component} /> is missing a parent <NetworkSwitcher /> component.`,
    );
    if (Error.captureStackTrace)
      Error.captureStackTrace(err, useNetworkSwitcherContext);
    throw err;
  }
  return context;
}

function stateReducer(state: StateDefinition, action: Actions) {
  return match(action.type, reducers, state, action);
}

// ---

const DEFAULT_NETWORKSWITCHER_TAG = Fragment;
interface NetworkSwitcherRenderPropArg {
  open: boolean;
  disabled: boolean;
}

const NetworkSwitcherRoot = forwardRefWithAs(function NetworkSwitcher<
  TTag extends ElementType = typeof DEFAULT_NETWORKSWITCHER_TAG,
>(
  props: Props<
    TTag,
    NetworkSwitcherRenderPropArg,
    'value' | 'disabled' | 'name' | 'onChange'
  > & {
    value: NetworkDetail | null | undefined;
    onChange(value: NetworkDetail): void;
    disabled?: boolean;
    name?: string;
  },
  ref: Ref<TTag>,
) {
  const {
    value,
    name,
    onChange,
    disabled = false,
    ...passThroughProps
  } = props;
  const networkSwitcherRef = useSyncRefs(ref);

  const reducerBag = useReducer(stateReducer, {
    networkSwitcherState: NetworkSwitcherStates.Closed,
    propsRef: { current: { value, onChange } },
    labelRef: createRef(),
    buttonRef: createRef(),
    optionsRef: createRef(),
    disabled,
    options: [],
    activeOptionIndex: null,
    activationTrigger: ActivationTrigger.Other,
  } as StateDefinition);
  const [{ networkSwitcherState, propsRef, optionsRef, buttonRef }, dispatch] =
    reducerBag;

  useIsoMorphicEffect(() => {
    propsRef.current.value = value;
  }, [value, propsRef]);
  useIsoMorphicEffect(
    () => dispatch({ type: ActionTypes.SetDisabled, disabled }),
    [disabled],
  );

  // Handle outside click
  useOutsideClick([buttonRef, optionsRef], (event, target) => {
    if (networkSwitcherState !== NetworkSwitcherStates.Open) return;

    dispatch({ type: ActionTypes.CloseNetworkSwitcher });

    if (!isFocusableElement(target, FocusableMode.Loose)) {
      event.preventDefault();
      buttonRef.current?.focus();
    }
  });

  const slot = useMemo<NetworkSwitcherRenderPropArg>(
    () => ({
      open: networkSwitcherState === NetworkSwitcherStates.Open,
      disabled,
    }),
    [networkSwitcherState, disabled],
  );

  const renderConfiguration = {
    props: { ref: networkSwitcherRef, ...passThroughProps },
    slot,
    defaultTag: DEFAULT_NETWORKSWITCHER_TAG,
    name: 'NetworkSwitcher',
  };

  return (
    <NetworkSwitcherContext.Provider value={reducerBag}>
      <OpenClosedProvider
        value={match(networkSwitcherState, {
          [NetworkSwitcherStates.Open]: State.Open,
          [NetworkSwitcherStates.Closed]: State.Closed,
        })}
      >
        {name != null && value != null ? (
          <>
            {objectToFormEntries({ [name]: value }).map(([name, value]) => (
              <VisuallyHidden
                {...compact({
                  key: name,
                  as: 'input',
                  type: 'hidden',
                  hidden: true,
                  readOnly: true,
                  name,
                  value,
                })}
              />
            ))}
            {render(renderConfiguration)}
          </>
        ) : (
          render(renderConfiguration)
        )}
      </OpenClosedProvider>
    </NetworkSwitcherContext.Provider>
  );
});

// ---

const DEFAULT_BUTTON_TAG = 'button' as const;
interface ButtonRenderPropArg {
  open: boolean;
  disabled: boolean;
}
type ButtonPropsWeControl =
  | 'id'
  | 'type'
  | 'aria-haspopup'
  | 'aria-controls'
  | 'aria-expanded'
  | 'aria-labelledby'
  | 'disabled'
  | 'onKeyDown'
  | 'onClick';

const Button = forwardRefWithAs(function Button<
  TTag extends ElementType = typeof DEFAULT_BUTTON_TAG,
>(
  props: Props<TTag, ButtonRenderPropArg, ButtonPropsWeControl>,
  ref: Ref<HTMLButtonElement>,
) {
  const [state, dispatch] = useNetworkSwitcherContext('NetworkSwitcher.Button');
  const buttonRef = useSyncRefs(state.buttonRef, ref);

  const id = `networkSwitcher-button-${useId()}`;
  const d = useDisposables();

  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLButtonElement>) => {
      switch (event.key) {
        // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-13

        case Keys.Space:
        case Keys.Enter:
        case Keys.ArrowDown:
          event.preventDefault();
          dispatch({ type: ActionTypes.OpenNetworkSwitcher });
          d.nextFrame(() => {
            if (!state.propsRef.current.value)
              dispatch({ type: ActionTypes.GoToOption, focus: Focus.First });
          });
          break;

        case Keys.ArrowUp:
          event.preventDefault();
          dispatch({ type: ActionTypes.OpenNetworkSwitcher });
          d.nextFrame(() => {
            if (!state.propsRef.current.value)
              dispatch({ type: ActionTypes.GoToOption, focus: Focus.Last });
          });
          break;
      }
    },
    [dispatch, state, d],
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

  const handleClick = useCallback(
    (event: ReactMouseEvent) => {
      if (isDisabledReactIssue7711(event.currentTarget))
        return event.preventDefault();
      if (state.networkSwitcherState === NetworkSwitcherStates.Open) {
        dispatch({ type: ActionTypes.CloseNetworkSwitcher });
        d.nextFrame(() =>
          state.buttonRef.current?.focus({ preventScroll: true }),
        );
      } else {
        event.preventDefault();
        dispatch({ type: ActionTypes.OpenNetworkSwitcher });
      }
    },
    [dispatch, d, state],
  );

  const labelledby = useComputed(() => {
    if (!state.labelRef.current) return undefined;
    return [state.labelRef.current.id, id].join(' ');
  }, [state.labelRef.current, id]);

  const slot = useMemo<ButtonRenderPropArg>(
    () => ({
      open: state.networkSwitcherState === NetworkSwitcherStates.Open,
      disabled: state.disabled,
    }),
    [state],
  );
  const passthroughProps = props;
  const propsWeControl = {
    ref: buttonRef,
    id,
    type: useResolveButtonType(props, state.buttonRef),
    'aria-haspopup': true,
    'aria-controls': state.optionsRef.current?.id,
    'aria-expanded': state.disabled
      ? undefined
      : state.networkSwitcherState === NetworkSwitcherStates.Open,
    'aria-labelledby': labelledby,
    disabled: state.disabled,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
    onClick: handleClick,
  };

  return render({
    props: { ...passthroughProps, ...propsWeControl },
    slot,
    defaultTag: DEFAULT_BUTTON_TAG,
    name: 'NetworkSwitcher.Button',
  });
});

// ---

const DEFAULT_LABEL_TAG = 'label' as const;
interface LabelRenderPropArg {
  open: boolean;
  disabled: boolean;
}
type LabelPropsWeControl = 'id' | 'ref' | 'onClick' | 'onChange';

const Label = forwardRefWithAs(function Label<
  TTag extends ElementType = typeof DEFAULT_LABEL_TAG,
>(
  props: Props<TTag, LabelRenderPropArg, LabelPropsWeControl>,
  ref: Ref<HTMLElement>,
) {
  const [state] = useNetworkSwitcherContext('NetworkSwitcher.Label');
  const id = `networkSwitcher-label-${useId()}`;
  const labelRef = useSyncRefs(state.labelRef, ref);

  const handleClick = useCallback(
    () => state.buttonRef.current?.focus({ preventScroll: true }),
    [state.buttonRef],
  );

  const slot = useMemo<LabelRenderPropArg>(
    () => ({
      open: state.networkSwitcherState === NetworkSwitcherStates.Open,
      disabled: state.disabled,
    }),
    [state],
  );
  const propsWeControl = {
    ref: labelRef,
    id,
    onClick: handleClick,
    onChange: handleClick,
  };
  return render({
    props: { ...props, ...propsWeControl },
    slot,
    defaultTag: DEFAULT_LABEL_TAG,
    name: 'NetworkSwitcher.Label',
  });
});

// ---

const DEFAULT_OPTIONS_TAG = 'ul' as const;
interface OptionsRenderPropArg {
  open: boolean;
}
type OptionsPropsWeControl =
  | 'aria-activedescendant'
  | 'aria-labelledby'
  | 'id'
  | 'onKeyDown'
  | 'role'
  | 'tabIndex';

const OptionsRenderFeatures = Features.RenderStrategy | Features.Static;

const Options = forwardRefWithAs(function Options<
  TTag extends ElementType = typeof DEFAULT_OPTIONS_TAG,
>(
  props: Props<TTag, OptionsRenderPropArg, OptionsPropsWeControl> &
    PropsForFeatures<typeof OptionsRenderFeatures>,
  ref: Ref<HTMLElement>,
) {
  const [state, dispatch] = useNetworkSwitcherContext(
    'NetworkSwitcher.Options',
  );
  const optionsRef = useSyncRefs(state.optionsRef, ref);

  const id = `networkSwitcher-options-${useId()}`;
  const d = useDisposables();
  const searchDisposables = useDisposables();

  const usesOpenClosedState = useOpenClosed();
  const visible = (() => {
    if (usesOpenClosedState !== null) {
      return usesOpenClosedState === State.Open;
    }

    return state.networkSwitcherState === NetworkSwitcherStates.Open;
  })();

  useEffect(() => {
    const container = state.optionsRef.current;
    if (!container) return;
    if (state.networkSwitcherState !== NetworkSwitcherStates.Open) return;
    if (container === getOwnerDocument(container)?.activeElement) return;

    container.focus({ preventScroll: true });
  }, [state.networkSwitcherState, state.optionsRef]);

  const handleKeyDown = useCallback(
    async (event: ReactKeyboardEvent<HTMLUListElement>) => {
      searchDisposables.dispose();

      switch (event.key) {
        // Ref: https://www.w3.org/TR/wai-aria-practices-1.2/#keyboard-interaction-12
        // When in type ahead mode, fallthrough
        case Keys.Enter:
          event.preventDefault();
          event.stopPropagation();
          dispatch({ type: ActionTypes.CloseNetworkSwitcher });
          if (state.activeOptionIndex !== null) {
            const { dataRef } = state.options[state.activeOptionIndex];
            try {
              await changeNetwork({
                chainId: Number(dataRef.current.value.chainId),
              });
              state.propsRef.current.onChange(dataRef.current.value);
            } catch (e: unknown) {
              const error = e as ProviderRpcError;
              if (error?.code === 4902) {
                try {
                  await addNetwork({
                    chainId: Number(dataRef.current.value.chainId),
                  });
                } catch (e: unknown) {
                  console.error(e);
                }
              }
              console.error(e);
            }
          }
          disposables().nextFrame(() =>
            state.buttonRef.current?.focus({ preventScroll: true }),
          );
          break;

        case Keys.Home:
        case Keys.PageUp:
          event.preventDefault();
          event.stopPropagation();
          return dispatch({ type: ActionTypes.GoToOption, focus: Focus.First });

        case Keys.End:
        case Keys.PageDown:
          event.preventDefault();
          event.stopPropagation();
          return dispatch({ type: ActionTypes.GoToOption, focus: Focus.Last });

        case Keys.ArrowDown:
          event.preventDefault();
          event.stopPropagation();
          return dispatch({ type: ActionTypes.GoToOption, focus: Focus.Next });

        case Keys.ArrowUp:
          event.preventDefault();
          event.stopPropagation();
          return dispatch({
            type: ActionTypes.GoToOption,
            focus: Focus.Previous,
          });

        case Keys.Escape:
          event.preventDefault();
          event.stopPropagation();
          dispatch({ type: ActionTypes.CloseNetworkSwitcher });
          return d.nextFrame(() =>
            state.buttonRef.current?.focus({ preventScroll: true }),
          );

        case Keys.Tab:
          event.preventDefault();
          event.stopPropagation();
          break;

        default:
          break;
      }
    },
    [d, dispatch, searchDisposables, state],
  );

  const labelledby = useComputed(
    () => state.labelRef.current?.id ?? state.buttonRef.current?.id,
    [state.labelRef.current, state.buttonRef.current],
  );

  const slot = useMemo<OptionsRenderPropArg>(
    () => ({ open: state.networkSwitcherState === NetworkSwitcherStates.Open }),
    [state],
  );
  const propsWeControl = {
    'aria-activedescendant':
      state.activeOptionIndex === null
        ? undefined
        : state.options[state.activeOptionIndex]?.id,
    'aria-labelledby': labelledby,
    id,
    onKeyDown: handleKeyDown,
    role: 'networkSwitcher',
    tabIndex: 0,
    ref: optionsRef,
  };
  const passthroughProps = props;

  return render({
    props: { ...passthroughProps, ...propsWeControl },
    slot,
    defaultTag: DEFAULT_OPTIONS_TAG,
    features: OptionsRenderFeatures,
    visible,
    name: 'NetworkSwitcher.Options',
  });
});

// ---

const DEFAULT_OPTION_TAG = 'li' as const;
interface OptionRenderPropArg {
  active: boolean;
  selected: boolean;
  disabled: boolean;
}
type NetworkSwitcherOptionPropsWeControl =
  | 'id'
  | 'role'
  | 'tabIndex'
  | 'aria-disabled'
  | 'aria-selected'
  | 'onPointerLeave'
  | 'onMouseLeave'
  | 'onPointerMove'
  | 'onMouseMove'
  | 'onFocus'
  | 'onChange';

const Option = forwardRefWithAs(function Option<
  TTag extends ElementType = typeof DEFAULT_OPTION_TAG,
>(
  props: Props<
    TTag,
    OptionRenderPropArg,
    NetworkSwitcherOptionPropsWeControl | 'value'
  > & {
    disabled?: boolean;
    value: NetworkDetail;
  },
  ref: Ref<HTMLElement>,
) {
  const { disabled = false, value, ...passthroughProps } = props;
  const [state, dispatch] = useNetworkSwitcherContext('NetworkSwitcher.Option');
  const id = `networkSwitcher-option-${useId()}`;
  const active =
    state.activeOptionIndex !== null
      ? state.options[state.activeOptionIndex].id === id
      : false;
  const selected = state.propsRef.current.value === value;
  const internalOptionRef = useRef<HTMLLIElement | null>(null);
  const optionRef = useSyncRefs(ref, internalOptionRef);

  useIsoMorphicEffect(() => {
    if (state.networkSwitcherState !== NetworkSwitcherStates.Open) return;
    if (!active) return;
    if (state.activationTrigger === ActivationTrigger.Pointer) return;
    const d = disposables();
    d.requestAnimationFrame(() => {
      internalOptionRef.current?.scrollIntoView?.({ block: 'nearest' });
    });
    return d.dispose;
  }, [
    internalOptionRef,
    active,
    state.networkSwitcherState,
    state.activationTrigger,
    /* We also want to trigger this when the position of the active item changes so that we can re-trigger the scrollIntoView */ state.activeOptionIndex,
  ]);

  const bag = useRef<NetworkSwitcherOptionDataRef['current']>({
    disabled,
    value,
    domRef: internalOptionRef,
  });

  useIsoMorphicEffect(() => {
    bag.current.disabled = disabled;
  }, [bag, disabled]);
  useIsoMorphicEffect(() => {
    bag.current.value = value;
  }, [bag, value]);
  useIsoMorphicEffect(() => {
    bag.current.textValue =
      internalOptionRef.current?.textContent?.toLowerCase();
  }, [bag, internalOptionRef]);

  const select = useCallback(async () => {
    try {
      await changeNetwork({
        chainId: Number(value.chainId),
      });
      state.propsRef.current.onChange(value);
    } catch (e: unknown) {
      const error = e as ProviderRpcError;
      if (error?.code === 4902) {
        try {
          await addNetwork({
            chainId: Number(value.chainId),
          });
          state.propsRef.current.onChange(value);
        } catch (e: unknown) {
          console.error(e);
        }
      }
    }
  }, [state.propsRef, value]);

  useIsoMorphicEffect(() => {
    dispatch({ type: ActionTypes.RegisterOption, id, dataRef: bag });
    return () => dispatch({ type: ActionTypes.UnregisterOption, id });
  }, [bag, id]);

  useIsoMorphicEffect(() => {
    if (state.networkSwitcherState !== NetworkSwitcherStates.Open) return;
    if (!selected) return;
    dispatch({ type: ActionTypes.GoToOption, focus: Focus.Specific, id });
  }, [state.networkSwitcherState]);

  const handleClick = useCallback(
    (event: { preventDefault: () => unknown }) => {
      if (disabled) return event.preventDefault();
      select();
      dispatch({ type: ActionTypes.CloseNetworkSwitcher });
      disposables().nextFrame(() =>
        state.buttonRef.current?.focus({ preventScroll: true }),
      );
    },
    [dispatch, state.buttonRef, disabled, select],
  );

  const handleFocus = useCallback(() => {
    if (disabled)
      return dispatch({ type: ActionTypes.GoToOption, focus: Focus.Nothing });
    dispatch({ type: ActionTypes.GoToOption, focus: Focus.Specific, id });
  }, [disabled, id, dispatch]);

  const handleMove = useCallback(() => {
    if (disabled) return;
    if (active) return;
    dispatch({
      type: ActionTypes.GoToOption,
      focus: Focus.Specific,
      id,
      trigger: ActivationTrigger.Pointer,
    });
  }, [disabled, active, id, dispatch]);

  const handleLeave = useCallback(() => {
    if (disabled) return;
    if (!active) return;
    dispatch({ type: ActionTypes.GoToOption, focus: Focus.Nothing });
  }, [disabled, active, dispatch]);

  const slot = useMemo<OptionRenderPropArg>(
    () => ({ active, selected, disabled }),
    [active, selected, disabled],
  );
  const propsWeControl = {
    id,
    ref: optionRef,
    role: 'option',
    tabIndex: disabled === true ? undefined : -1,
    'aria-disabled': disabled === true ? true : undefined,
    'aria-selected': selected === true ? true : undefined,
    disabled: undefined, // Never forward the `disabled` prop
    onClick: handleClick,
    onFocus: handleFocus,
    onPointerMove: handleMove,
    onMouseMove: handleMove,
    onPointerLeave: handleLeave,
    onMouseLeave: handleLeave,
    onChange: handleClick,
  };

  return render({
    props: { ...passthroughProps, ...propsWeControl },
    slot,
    defaultTag: DEFAULT_OPTION_TAG,
    name: 'NetworkSwitcher.Option',
  });
});

export const NetworkSwitcher = Object.assign(NetworkSwitcherRoot, {
  Button,
  Label,
  Options,
  Option,
});
