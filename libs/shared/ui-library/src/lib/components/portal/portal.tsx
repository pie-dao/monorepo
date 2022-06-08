import React, {
  Fragment,
  createContext,
  useContext,
  useEffect,
  useState,

  // Types
  ElementType,
  MutableRefObject,
  Ref,
  useRef,
} from 'react';
import { createPortal } from 'react-dom';

import { Props } from '../../types/types';
import { forwardRefWithAs, render } from '../../utils/render';
import { useIsoMorphicEffect } from '../../hooks/use-iso-morphic-effect';
import { usePortalRoot } from '../../internal/portal-force-root';
import { useServerHandoffComplete } from '../../hooks/use-server-handoff-complete';
import { optionalRef, useSyncRefs } from '../../hooks/use-sync-refs';
import { useOwnerDocument } from '../../hooks/use-owner';

function usePortalTarget(
  ref: MutableRefObject<HTMLElement | null>,
): HTMLElement | null {
  const forceInRoot = usePortalRoot();
  const groupTarget = useContext(PortalGroupContext);

  const ownerDocument = useOwnerDocument(ref);

  const [target, setTarget] = useState(() => {
    // Group context is used, but still null
    if (!forceInRoot && groupTarget !== null) return null;

    // No group context is used, let's create a default portal root
    if (typeof window === 'undefined') return null;
    let existingRoot = ownerDocument?.getElementById('piedao-portal-root');
    if (window.location !== window.parent.location) {
      existingRoot = ownerDocument?.getElementById('storybook-portal');
    }
    if (existingRoot) return existingRoot;

    if (ownerDocument === null) return null;

    const root = ownerDocument.createElement('div');
    root.setAttribute('id', 'piedao-portal-root');
    return ownerDocument.body.appendChild(root);
  });

  // Ensure the portal root is always in the DOM
  useEffect(() => {
    if (target === null) return;

    if (!ownerDocument?.body.contains(target)) {
      ownerDocument?.body.appendChild(target);
    }
  }, [target, ownerDocument]);

  useEffect(() => {
    if (forceInRoot) return;
    if (groupTarget === null) return;
    setTarget(groupTarget.current);
  }, [groupTarget, setTarget, forceInRoot]);

  return target;
}

// ---

const DEFAULT_PORTAL_TAG = Fragment;

const PortalRoot = forwardRefWithAs(function Portal<
  TTag extends ElementType = typeof DEFAULT_PORTAL_TAG,
>(props: Props<TTag>, ref: Ref<HTMLElement>) {
  const passthroughProps = props;
  const internalPortalRootRef = useRef<HTMLElement | null>(null);
  const portalRef = useSyncRefs(
    optionalRef<typeof internalPortalRootRef['current']>((ref) => {
      internalPortalRootRef.current = ref;
    }),
    ref,
  );
  const ownerDocument = useOwnerDocument(internalPortalRootRef);
  const target = usePortalTarget(internalPortalRootRef);
  const [element] = useState<HTMLDivElement | null>(() =>
    typeof window === 'undefined'
      ? null
      : ownerDocument?.createElement('div') ?? null,
  );

  const ready = useServerHandoffComplete();

  useIsoMorphicEffect(() => {
    if (!target) return;
    if (!element) return;

    target.appendChild(element);

    return () => {
      if (!target) return;
      if (!element) return;

      target.removeChild(element);

      if (target.childNodes.length <= 0) {
        target.parentElement?.removeChild(target);
      }
    };
  }, [target, element]);

  if (!ready) return null;

  return !target || !element
    ? null
    : createPortal(
        render({
          props: { ref: portalRef, ...passthroughProps },
          defaultTag: DEFAULT_PORTAL_TAG,
          name: 'Portal',
        }),
        element,
      );
});

// ---

const DEFAULT_GROUP_TAG = Fragment;

const PortalGroupContext =
  createContext<MutableRefObject<HTMLElement | null> | null>(null);

const Group = forwardRefWithAs(function Group<
  TTag extends ElementType = typeof DEFAULT_GROUP_TAG,
>(
  props: Props<TTag> & {
    target: MutableRefObject<HTMLElement | null>;
  },
  ref: Ref<HTMLElement>,
) {
  const { target, ...passthroughProps } = props;
  const groupRef = useSyncRefs(ref);

  return (
    <PortalGroupContext.Provider value={target}>
      {render({
        props: { ref: groupRef, ...passthroughProps },
        defaultTag: DEFAULT_GROUP_TAG,
        name: 'Popover.Group',
      })}
    </PortalGroupContext.Provider>
  );
});

// ---
export const Portal = Object.assign(PortalRoot, { Group });
