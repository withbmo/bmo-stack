import { NovuProvider, useCounts, useNotifications } from '@novu/react';
import { MotionPopover, Presence } from '@pytholit/ui';
import { Bell, X } from 'lucide-react';
import { type RefObject,useEffect, useRef, useState } from 'react';

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
        ? 'text-red-400'
        : severity === 'medium'
          ? 'text-yellow-400'
          : severity === 'low'
            ? 'text-nexus-accent'
            : 'text-nexus-purple';
    const unread = !notification?.isRead;

    return (
      <div className="p-4 border-b border-nexus-gray/30 hover:bg-nexus-purple/5 transition-colors group cursor-pointer">
        <div className="flex justify-between items-center mb-1">
          <span
            className={`text-[9px] font-mono font-bold uppercase tracking-wider ${severityColor}`}
          >
            [{severity}]
          </span>
          <span className="text-[9px] text-nexus-muted font-mono">{time}</span>
        </div>
        <div className="flex items-start gap-2">
          <div
            className={`mt-1 w-1.5 h-1.5 rounded-full ${unread ? 'bg-nexus-purple' : 'bg-nexus-gray/40'}`}
          />
          <div className="flex-1">
            <h4 className="font-sans font-bold text-sm text-white mb-1 group-hover:text-nexus-purple transition-colors">
              {title}
            </h4>
            {body ? (
              <p className="font-mono text-xs text-nexus-light/60 leading-tight">{body}</p>
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
      className={`relative w-9 h-9 grid place-items-center rounded-md border bg-nexus-black/80 transition-colors shadow-[0_0_20px_-10px_rgba(139,92,246,0.7)] ${
        open
          ? 'border-nexus-purple text-white'
          : 'border-nexus-gray hover:border-nexus-purple hover:text-white'
      }`}
      aria-label="Notifications"
      onClick={onToggle}
    >
      <Bell size={16} className="text-nexus-light" />
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-mono flex items-center justify-center">
          {unread > 99 ? '99+' : unread}
        </span>
      )}
      <span className="absolute inset-0 rounded-md ring-1 ring-nexus-purple/10 pointer-events-none" />
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
      className="absolute right-0 top-12 w-[380px] bg-[#050505] border border-nexus-gray shadow-[0_0_60px_-16px_rgba(109,40,217,0.6)] z-[100]"
    >
      <div className="flex justify-between items-center p-3 border-b border-nexus-gray bg-black/80 backdrop-blur">
        <div className="flex items-center gap-2">
          <span className="inline-flex w-1.5 h-1.5 rounded-full bg-nexus-purple animate-pulse" />
          <span className="font-mono text-[10px] font-bold text-white tracking-widest uppercase">
            NOTIFICATIONS
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-nexus-muted hover:text-white transition-colors"
          aria-label="Close notifications"
        >
          <X size={14} />
        </button>
      </div>

      <div className="max-h-[380px] overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-xs font-mono text-nexus-muted">LOADING...</div>
        ) : notifications && notifications.length > 0 ? (
          notifications.map(notification => (
            <div key={notification.id}>{renderNotification(notification)}</div>
          ))
        ) : (
          <div className="p-8 text-center">
            <div className="mx-auto mb-3 h-10 w-10 rounded-full border border-nexus-gray/40 bg-nexus-black/70 grid place-items-center">
              <Bell size={16} className="text-nexus-muted" />
            </div>
            <div className="text-[10px] font-mono text-nexus-muted tracking-widest">
              NO NOTIFICATIONS
            </div>
          </div>
        )}
        {hasMore ? (
          <button
            className="w-full py-2 text-[10px] font-mono text-nexus-muted hover:text-white uppercase tracking-wider transition-colors hover:bg-nexus-gray/10"
            onClick={() => fetchMore()}
            disabled={isFetching}
          >
            {isFetching ? 'LOADING...' : 'LOAD_MORE'}
          </button>
        ) : null}
      </div>

      <div className="p-2 bg-black/80 text-center border-t border-nexus-gray">
        <button
          className="text-[10px] font-mono text-nexus-muted hover:text-white uppercase tracking-wider transition-colors py-1 w-full hover:bg-nexus-gray/10"
          onClick={() => readAll()}
        >
          MARK ALL READ
        </button>
      </div>
    </MotionPopover>
  );
};
