import { useNavigate } from 'react-router';
import { Plane, Star, Shield, Clock, ArrowRight } from 'lucide-react';
import { FlightSearchWidget } from '../components/FlightSearchWidget';
import { useApp } from '../context/AppContext';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1683971336619-d445cbec0276?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhaXJwb3J0JTIwcnVud2F5JTIwYWVyaWFsJTIwdmlldyUyMGRyYW1hdGljJTIwc2t5fGVufDF8fHx8MTc4MDQ4ODUxN3ww&ixlib=rb-4.1.0&q=80&w=1080';

const STATS = [
  { value: '180+', label: 'Destinations' },
  { value: '2.4M', label: 'Passengers Yearly' },
  { value: '98%', label: 'On-time Rate' },
  { value: '4.8★', label: 'Avg Rating' },
];

const FEATURES = [
  { icon: Star, title: 'Award-Winning Service', desc: 'Rated #1 airline for comfort and reliability for 5 consecutive years.' },
  { icon: Shield, title: 'Safe & Reliable', desc: 'The highest safety standards with a modern fleet maintained to perfection.' },
  { icon: Clock, title: 'Always On Time', desc: 'Our 98% on-time performance ensures you arrive when you expect to.' },
];

export default function Landing() {
  const { user } = useApp();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_IMAGE} alt="Airport runway at sunset" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#0A1F44]/70" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A1F44]/20 via-transparent to-[#0A1F44]/80" />
        </div>

        {/* Floating plane accent */}
        <div className="absolute top-20 right-20 opacity-10 hidden lg:block">
          <Plane className="w-64 h-64 text-white -rotate-12" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm mb-6">
            <Plane className="w-4 h-4 text-[#2E8FD8]" />
            Premium Global Aviation
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
            The World<br />
            <span className="text-[#2E8FD8]">Awaits You</span>
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-xl mx-auto mb-8">
            Book flights to 180+ destinations worldwide with confidence, comfort, and care.
          </p>
        </div>

        {/* Search widget */}
        <div className="relative z-10 w-full max-w-3xl px-4">
          <FlightSearchWidget />
        </div>

        {/* Stats */}
        <div className="relative z-10 mt-10 flex gap-8 flex-wrap justify-center">
          {STATS.map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-2xl font-bold text-white">{value}</div>
              <div className="text-white/60 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Guest CTA Banner */}
      {!user && (
        <section className="bg-[#2E8FD8] py-4">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-3">
            <p className="text-white">
              <span className="font-semibold">Create an account</span> to book flights, manage your itinerary, and access exclusive member fares.
            </p>
            <button onClick={() => navigate('/auth?mode=register')}
              className="flex items-center gap-2 bg-white text-[#2E8FD8] font-semibold px-5 py-2 rounded-xl hover:bg-blue-50 transition-colors text-sm shrink-0">
              Get Started <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[#0A1F44] mb-2">Why fly with Avion?</h2>
            <p className="text-gray-500">Excellence at every altitude</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-[#F4F7FB] rounded-2xl p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-[#EFF6FF] rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#2E8FD8]" />
                </div>
                <h3 className="text-[#0A1F44] mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular routes */}
      <section className="py-20 bg-[#F4F7FB]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-[#0A1F44] mb-2">Popular Routes</h2>
            <p className="text-gray-500">Top destinations our passengers love</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { from: 'New York', to: 'London', price: 489, code: 'JFK → LHR' },
              { from: 'London', to: 'Tokyo', price: 890, code: 'LHR → NRT' },
              { from: 'Paris', to: 'Dubai', price: 720, code: 'CDG → DXB' },
              { from: 'LA', to: 'Sydney', price: 1100, code: 'LAX → SYD' },
            ].map(r => (
              <button key={r.code} onClick={() => navigate('/search')}
                className="bg-white rounded-2xl p-5 text-left hover:shadow-lg hover:scale-[1.02] transition-all group border border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <Plane className="w-4 h-4 text-[#2E8FD8] group-hover:translate-x-1 transition-transform" />
                  <span className="text-xs text-gray-400 font-mono">{r.code}</span>
                </div>
                <div className="text-[#0A1F44] font-semibold mb-0.5">{r.from} → {r.to}</div>
                <div className="text-[#2E8FD8] font-bold">from ${r.price}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A1F44] text-white/60 py-8">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Plane className="w-5 h-5 text-[#2E8FD8]" />
            <span className="text-white font-bold">AVI<span className="text-[#2E8FD8]">ON</span></span>
          </div>
          <p className="text-sm">© 2026 Avion Airways. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            {['Privacy', 'Terms', 'Contact', 'Careers'].map(l => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
