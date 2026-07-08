import type { FlightStatus, BookingStatus, AircraftStatus, AvailabilityStatus } from '../types';

type BadgeStatus = FlightStatus | BookingStatus | AircraftStatus | AvailabilityStatus;

const CONFIG: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  // Flight statuses
  scheduled:   { label: 'Scheduled',   bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
  boarding:    { label: 'Boarding',    bg: 'bg-teal-100',    text: 'text-teal-700',    dot: 'bg-teal-500'    },
  delayed:     { label: 'Delayed',     bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  departed:    { label: 'Departed',    bg: 'bg-purple-100',  text: 'text-purple-700',  dot: 'bg-purple-500'  },
  arrived:     { label: 'Arrived',     bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  confirmed:   { label: 'Confirmed',   bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  cancelled:   { label: 'Cancelled',   bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500'     },
  // Booking / payment
  pending:     { label: 'Pending',     bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  paid:        { label: 'Paid',        bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  failed:      { label: 'Failed',      bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500'     },
  refunded:    { label: 'Refunded',    bg: 'bg-gray-100',    text: 'text-gray-600',    dot: 'bg-gray-400'    },
  // Aircraft
  available:   { label: 'Available',   bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  assigned:    { label: 'Assigned',    bg: 'bg-blue-100',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
  maintenance: { label: 'Maintenance', bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  retired:     { label: 'Retired',     bg: 'bg-gray-100',    text: 'text-gray-500',    dot: 'bg-gray-400'    },
  // Staff availability
  unavailable: { label: 'Unavailable', bg: 'bg-red-100',     text: 'text-red-700',     dot: 'bg-red-500'     },
  'on-leave':  { label: 'On Leave',    bg: 'bg-gray-100',    text: 'text-gray-600',    dot: 'bg-gray-400'    },
  training:    { label: 'Training',    bg: 'bg-amber-100',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
};

interface Props {
  status: BadgeStatus;
  showDot?: boolean;
  size?: 'sm' | 'md';
}

export function StatusBadge({ status, showDot = true, size = 'md' }: Props) {
  const cfg = CONFIG[status] ?? { label: status, bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' };
  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ${px} ${cfg.bg} ${cfg.text}`}>
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />}
      {cfg.label}
    </span>
  );
}
