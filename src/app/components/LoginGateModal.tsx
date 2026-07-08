import * as Dialog from '@radix-ui/react-dialog';
import { X, PlaneTakeoff, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

interface Props {
  open: boolean;
  onClose: () => void;
}

export function LoginGateModal({ open, onClose }: Props) {
  const { loginGateFlight } = useApp();
  const navigate = useNavigate();

  const goToAuth = (mode: 'signin' | 'register') => {
    onClose();
    navigate(`/auth?mode=${mode}`);
  };

  return (
    <Dialog.Root open={open} onOpenChange={v => !v && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 relative">
            <Dialog.Close asChild>
              <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </Dialog.Close>

            {/* Icon */}
            <div className="w-14 h-14 bg-[#EFF6FF] rounded-2xl flex items-center justify-center mb-4">
              <PlaneTakeoff className="w-7 h-7 text-[#2E8FD8]" />
            </div>

            <Dialog.Title className="text-xl text-[#0A1F44] mb-1">
              Sign in to complete your booking
            </Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 mb-5">
              Create an account or sign in to book this flight and manage your trips.
            </Dialog.Description>

            {/* Selected flight preview */}
            {loginGateFlight && (
              <div className="bg-[#F4F7FB] rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Flight {loginGateFlight.number}</div>
                    <div className="text-sm font-semibold text-[#0A1F44]">
                      {loginGateFlight.originCode} → {loginGateFlight.destinationCode}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {loginGateFlight.departureTime} — {loginGateFlight.date}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-semibold text-[#0A1F44]">${loginGateFlight.price}</div>
                    <div className="text-xs text-gray-500 capitalize">{loginGateFlight.class}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button onClick={() => goToAuth('signin')}
                className="w-full bg-[#0A1F44] hover:bg-[#0d2a5e] text-white rounded-xl py-3 flex items-center justify-center gap-2 transition-colors">
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={() => goToAuth('register')}
                className="w-full border-2 border-[#0A1F44] text-[#0A1F44] hover:bg-[#0A1F44] hover:text-white rounded-xl py-3 transition-colors">
                Create Account
              </button>
            </div>

            <button onClick={onClose} className="w-full text-center text-sm text-gray-400 hover:text-gray-600 mt-4 transition-colors">
              Dismiss, continue browsing
            </button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
