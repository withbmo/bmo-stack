import { NovuProvider, useCounts, useNotifications } from '@novu/react';
import { MotionPopover, Presence } from '@pytholit/ui/ui';
import { Bell, X } from 'lucide-react';
import { type RefObject, useEffect, useRef, useState } from 'react';

import { env } from '@/env';
import { useAuth } from '@/shared/auth';
import { getNovuToken, type NovuTokenResponse } from '@/shared/lib/notifications';

const NOVU_APP_ID = env.NEXT_PUBLIC_NOVU_APP_ID ?? '';
const NOVU_API_URL = env.NEXT_PUBLIC_NOVU_API_URL ?? '';
const NOVU_WS_URL = env.NEXT_PUBLIC_NOVU_WS_URL ?? '';

const normalizeRelativeUrl = (value: string) => {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  if (value.startsWith('/')) return value;
  return `/${value}`;
};

const toAbsoluteUrl = (value: string) => {
  if (!value) return '';
  if (value.startsWith('http://') || value.startsWith('https://')) return value;
  return new URL(value, window.location.origin).toString();
};

export const NovuInbox = () => {
  const { user, hydrated } = useAuth();
  const [auth, setAuth] = useState<NovuTokenResponse | null>(null);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hydrated || !user || !NOVU_APP_ID) {
      setAuth(null);
      return;
    }
    let mounted = true;
    (async () => {
      try {
        const res = await getNovuToken(undefined);
        if (mounted) setAuth(res);
      } catch {
        if (mounted) setAuth(null);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [hydrated, user]);

  const formatTime = (iso?: string) => {
    if (!iso) return '';
    const then = new Date(iso).getTime();
    const now = Date.now();
    const seconds = Math.max(0, Math.floor((now - then) / 1000));
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const renderNotification = (notification: any) => {
    const title =
      notification?.subject ||
      notification?.data?.title ||
      notification?.workflow?.name ||
      'Notification';
    const body =
      notification?.body || notification?.data?.message || notification?.data?.body || '';
    const time = formatTime(notification?.createdAt);
    const severity = notification?.severity || 'none';
    const severityColor =
      severity === 'high'
        ? 'text-state-error'
        : severity === 'medium'
          ? 'text-state-warning'
          : severity === 'low'
            ? 'text-brand-accent'
            : 'text-brand-primary';
    const unread = !notification?.isRead;

    return (
      <div className="group cursor-pointer border-b border-border-default/40 p-4 transition-colors hover:bg-brand-primary/5">
        <div className="flex justify-between items-center mb-1">
          <span
            className={`text-[9px] font-mono font-bold uppercase tracking-wider ${severityColor}`}
          >
            [{severity}]
          </span>
          <span className="font-mono text-[9px] text-text-muted">{time}</span>
        </div>
        <div className="flex items-start gap-2">
          <div
            className={`mt-1 h-1.5 w-1.5 rounded-full ${unread ? 'bg-brand-primary' : 'bg-border-default/40'}`}
          />
          <div className="flex-1">
            <h4 className="mb-1 text-sm font-sans font-bold text-white transition-colors group-hover:text-brand-primary">
              {title}
            </h4>
            {body ? (
              <p className="font-mono text-xs leading-tight text-text-secondary/80">{body}</p>
            ) : null}
          </div>
        </div>
      </div>
    );
  };

  if (!hydrated || !user || !NOVU_APP_ID || !auth?.subscriber_id) return null;

  return (
    <NovuProvider
      applicationIdentifier={NOVU_APP_ID}
      subscriberId={auth.subscriber_id}
      subscriberHash={auth.subscriber_hash}
      backendUrl={toAbsoluteUrl(normalizeRelativeUrl(NOVU_API_URL)) || undefined}
      socketUrl={toAbsoluteUrl(normalizeRelativeUrl(NOVU_WS_URL)) || undefined}
    >
      <div className="relative">
        <CustomBell open={open} onToggle={() => setOpen(prev => !prev)} />
        <Presence>
          {open ? (
            <CustomPanel
              panelRef={panelRef as React.RefObject<HTMLDivElement>}
              onClose={() => setOpen(false)}
              renderNotification={renderNotification}
            />
          ) : null}
        </Presence>
      </div>
    </NovuProvider>
  );
};

type CustomBellProps = {
  open: boolean;
  onToggle: () => void;
};

const CustomBell = ({ open, onToggle }: CustomBellProps) => {
  const { counts } = useCounts({ filters: [{ read: false }] });
  const unread = counts?.[0]?.count ?? 0;

  return (
    <button
      className={`relative grid h-9 w-9 place-items-center rounded-md border bg-bg-canvas/80 transition-colors shadow-[var(--shadow-brand)] ${
        open
          ? 'border-brand-primary text-white'
          : 'border-border-default hover:border-brand-primary hover:text-white'
      }`}
      aria-label="Notifications"
      onClick={onToggle}
    >
      <Bell size={16} className="text-text-secondary" />
      {unread > 0 && (
        <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-state-error px-1 font-mono text-[10px] text-white">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
      <span className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-brand-primary/10" />
    </button>
  );
};

type CustomPanelProps = {
  panelRef: RefObject<HTMLDivElement>;
  onClose: () => void;
  renderNotification: (notification: any) => React.ReactElement;
};

const CustomPanel = ({ panelRef, onClose, renderNotification }: CustomPanelProps) => {
  const { notifications, isLoading, isFetching, hasMore, fetchMore, readAll } = useNotifications({
    read: false,
    limit: 20,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose, panelRef]);

  return (
    <MotionPopover
      ref={panelRef}
      className="absolute right-0 top-12 z-[var(--z-overlay)] w-[380px] border border-border-default bg-bg-canvas shadow-[var(--shadow-panel)]"
    >
      <div className="flex items-center justify-between border-b border-border-default bg-bg-canvas/80 p-3 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-white">
            NOTIFICATIONS
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-text-muted transition-colors hover:text-white"
          aria-label="Close notifications"
        >
          <X size={14} />
        </button>
      </div>

      <div className="max-h-[380px] overflow-y-auto">
        {isLoading ? (
          <div className="p-4 font-mono text-xs text-text-muted">LOADING...</div>
        ) : notifications && notifications.length > 0 ? (
          notifications.map(notification => (
            <div key={notification.id}>{renderNotification(notification)}</div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full border border-border-default/40 bg-bg-app/70">
              <Bell size={16} className="text-text-muted" />
            </div>
            <div className="font-mono text-[10px] tracking-widest text-text-muted">
              NO NOTIFICATIONS
            </div>
          </div>
        )}
        {hasMore ? (
          <button
            className="w-full py-2 font-mono text-[10px] uppercase tracking-wider text-text-muted transition-colors hover:bg-border-default/10 hover:text-white"
            onClick={() => fetchMore()}
            disabled={isFetching}
          >
            {isFetching ? 'LOADING...' : 'LOAD_MORE'}
          </button>
        ) : null}
      </div>

      <div className="border-t border-border-default bg-bg-canvas/80 p-2 text-center">
        <button
          className="w-full py-1 font-mono text-[10px] uppercase tracking-wider text-text-muted transition-colors hover:bg-border-default/10 hover:text-white"
          onClick={() => readAll()}
        >
          MARK ALL READ
        </button>
      </div>
    </MotionPopover>
  );
};
