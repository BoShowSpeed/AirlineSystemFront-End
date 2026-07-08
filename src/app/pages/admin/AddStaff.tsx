import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, User, Mail, Phone, Briefcase, Shield, CheckCircle2,
  ChevronRight, ChevronDown, BadgeCheck, CalendarDays, Star,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatusBadge } from '../../components/StatusBadge';
import type { StaffMember, AvailabilityStatus, StaffRole } from '../../types';
import { STAFF_ROLE_LABELS } from '../../types';

const ROLE_OPTIONS: { value: StaffRole; label: string }[] = [
  { value: 'pilot',      label: 'Captain / Pilot' },
  { value: 'copilot',    label: 'First Officer / Co-Pilot' },
  { value: 'cabin_crew', label: 'Cabin Crew / Flight Attendant' },
  { value: 'manager',    label: 'Cabin Manager / Purser' },
  { value: 'technician', label: 'Maintenance Technician' },
];

const LICENSE_TYPES = [
  { code: 'ATP', label: 'ATP — Airline Transport Pilot' },
  { code: 'CPL', label: 'CPL — Commercial Pilot License' },
  { code: 'PPL', label: 'PPL — Private Pilot License' },
  { code: 'FA',  label: 'FA  — Flight Attendant Certificate' },
  { code: 'AME', label: 'AME — Aircraft Maintenance Engineer' },
  { code: 'GND', label: 'GND — Ground Operations' },
];

const COUNTRIES = ['US', 'GB', 'FR', 'DE', 'AE', 'SG', 'AU', 'JP'];

const AVAILABILITY_OPTIONS: { value: AvailabilityStatus; label: string; desc: string }[] = [
  { value: 'available',   label: 'Available',   desc: 'Ready to receive flight assignments' },
  { value: 'unavailable', label: 'Unavailable',  desc: 'Currently cannot take assignments' },
  { value: 'on-leave',    label: 'On Leave',     desc: 'On approved leave — not assignable' },
];

const STEPS = ['Personal Info', 'Credentials', 'Availability'];

function initials(name: string) {
  return name.trim().split(/\s+/).map(w => w[0]?.toUpperCase() ?? '').join('').slice(0, 2);
}

const inputClass = 'w-full bg-[#F4F7FB] border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2E8FD8] focus:border-transparent';
const selectClass = `${inputClass} appearance-none cursor-pointer`;

export default function AddStaff() {
  const { addStaffMember } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [newMember, setNewMember] = useState<StaffMember | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<StaffRole | ''>('');
  const [yearsExp, setYearsExp] = useState(1);
  const [licenseType, setLicenseType] = useState('ATP');
  const [licenseCountry, setLicenseCountry] = useState('US');
  const [licenseNum, setLicenseNum] = useState('');
  const [licenseExpiry, setLicenseExpiry] = useState('');
  const [availability, setAvailability] = useState<AvailabilityStatus>('available');
  const [emergencyName, setEmergencyName] = useState('');
  const [emergencyPhone, setEmergencyPhone] = useState('');
  const [notes, setNotes] = useState('');

  const fullLicense = licenseNum ? `${licenseType}-${licenseCountry}-${licenseNum}` : `${licenseType}-${licenseCountry}-XXXXX`;

  const stepValid = [
    name.trim().length > 1 && email.includes('@') && role !== '',
    licenseNum.trim().length > 2 && licenseExpiry !== '',
    true,
  ];

  const handleSubmit = () => {
    const member: StaffMember = {
      id: `staff-${Date.now()}`,
      name: name.trim(),
      role: role as StaffRole,
      email: email.trim(),
      phone: phone.trim() || '—',
      license: fullLicense,
      availability,
      initials: initials(name),
      assignments: [],
      nextFlight: undefined,
      yearsExp,
    };
    addStaffMember(member);
    setNewMember(member);
    setSubmitted(true);
  };

  /* ── Success screen ── */
  if (submitted && newMember) {
    return (
      <div className="min-h-screen bg-[#F4F7FB] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-[#0A1F44] mb-2">Staff Member Added</h2>
          <p className="text-gray-500 text-sm mb-6">
            <span className="font-semibold text-[#0A1F44]">{newMember.name}</span> has been added to the crew directory and is now available for assignment.
          </p>

          {/* Mini card preview */}
          <div className="bg-[#F4F7FB] rounded-xl p-4 flex items-center gap-3 text-left mb-6">
            <div className="w-10 h-10 rounded-full bg-[#0A1F44] text-white text-sm font-bold flex items-center justify-center shrink-0">
              {newMember.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[#0A1F44] text-sm">{newMember.name}</div>
              <div className="text-xs text-gray-500">{STAFF_ROLE_LABELS[newMember.role]} · {newMember.license}</div>
            </div>
            <StatusBadge status={newMember.availability} size="sm" />
          </div>

          <div className="flex gap-3">
            <button onClick={() => { setSubmitted(false); setStep(0); setName(''); setEmail(''); setPhone(''); setRole(''); setLicenseNum(''); setLicenseExpiry(''); setNotes(''); setEmergencyName(''); setEmergencyPhone(''); }}
              className="flex-1 border border-gray-200 text-gray-600 rounded-xl py-2.5 text-sm hover:bg-gray-50 transition-colors">
              Add Another
            </button>
            <button onClick={() => navigate('/admin/crew')}
              className="flex-1 bg-[#0A1F44] hover:bg-[#2E8FD8] text-white rounded-xl py-2.5 text-sm transition-colors">
              View Directory
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <div className="min-h-screen bg-[#F4F7FB] p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/crew')}
          className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0">
          <ArrowLeft className="w-4 h-4 text-gray-500" />
        </button>
        <div>
          <h2 className="text-[#0A1F44]">Add Staff Member</h2>
          <p className="text-sm text-gray-500 mt-0.5">Register a new crew member to the Avion roster</p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 max-w-2xl">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => i < step && setStep(i)}
              className="flex items-center gap-2 group">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
                i < step  ? 'bg-emerald-500 text-white' :
                i === step ? 'bg-[#0A1F44] text-white' :
                'bg-white border-2 border-gray-200 text-gray-400'
              }`}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm hidden sm:block ${i === step ? 'text-[#0A1F44] font-medium' : i < step ? 'text-emerald-600' : 'text-gray-400'}`}>
                {label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px mx-2 ${i < step ? 'bg-emerald-300' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 max-w-5xl">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm p-6">

            {/* ── Step 0: Personal Info ── */}
            {step === 0 && (
              <div className="space-y-5">
                <SectionTitle icon={User} label="Personal Information" />

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name <Required /></label>
                    <input value={name} onChange={e => setName(e.target.value)}
                      className={inputClass} placeholder="e.g. Capt. James Wilson" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address <Required /></label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                      className={inputClass} placeholder="name@avion.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      className={inputClass} placeholder="+1 555-0100" />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <SectionTitle icon={Briefcase} label="Role & Experience" />
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Role / Position <Required /></label>
                      <div className="relative">
                        <select value={role} onChange={e => setRole(e.target.value as StaffRole)} className={selectClass}>
                          <option value="">Select a role</option>
                          {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Years of Experience</label>
                      <input type="number" min={0} max={50} value={yearsExp}
                        onChange={e => setYearsExp(Number(e.target.value))}
                        className={inputClass} placeholder="5" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <SectionTitle icon={User} label="Emergency Contact" optional />
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Name</label>
                      <input value={emergencyName} onChange={e => setEmergencyName(e.target.value)}
                        className={inputClass} placeholder="Full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Contact Phone</label>
                      <input type="tel" value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)}
                        className={inputClass} placeholder="+1 555-0199" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 1: Credentials ── */}
            {step === 1 && (
              <div className="space-y-5">
                <SectionTitle icon={BadgeCheck} label="License & Certifications" />
                <p className="text-sm text-gray-500">
                  Enter the regulatory license details. These will be displayed in the crew directory and used for assignment eligibility.
                </p>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">License Type <Required /></label>
                    <div className="relative">
                      <select value={licenseType} onChange={e => setLicenseType(e.target.value)} className={selectClass}>
                        {LICENSE_TYPES.map(l => <option key={l.code} value={l.code}>{l.code}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Issuing Country <Required /></label>
                    <div className="relative">
                      <select value={licenseCountry} onChange={e => setLicenseCountry(e.target.value)} className={selectClass}>
                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">License Number <Required /></label>
                    <input value={licenseNum} onChange={e => setLicenseNum(e.target.value.replace(/\D/g, '').slice(0, 8))}
                      className={inputClass} placeholder="78234" />
                  </div>
                </div>

                {/* Live license preview */}
                <div className="bg-[#EFF6FF] border border-blue-100 rounded-xl p-4 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-[#2E8FD8] shrink-0" />
                  <div>
                    <div className="text-xs text-gray-500 mb-0.5">Generated License ID</div>
                    <div className="font-mono font-semibold text-[#0A1F44]">{fullLicense}</div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Issue Date</label>
                    <input type="date" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry Date <Required /></label>
                    <input type="date" value={licenseExpiry} onChange={e => setLicenseExpiry(e.target.value)}
                      className={inputClass} />
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <SectionTitle icon={Star} label="Qualifications & Ratings" optional />
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {['Boeing 777', 'Airbus A380', 'Boeing 787', 'Airbus A350', 'Boeing 737', 'Airbus A320'].map(q => (
                      <label key={q} className="flex items-center gap-2 bg-[#F4F7FB] rounded-lg px-3 py-2 cursor-pointer hover:bg-[#EFF6FF] transition-colors">
                        <input type="checkbox" className="accent-[#0A1F44] w-4 h-4" />
                        <span className="text-xs text-gray-700">{q}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Additional Notes</label>
                  <textarea value={notes} onChange={e => setNotes(e.target.value)}
                    className={`${inputClass} resize-none h-20`}
                    placeholder="Any additional qualifications, specializations, or background notes..." />
                </div>
              </div>
            )}

            {/* ── Step 2: Availability ── */}
            {step === 2 && (
              <div className="space-y-5">
                <SectionTitle icon={CalendarDays} label="Initial Availability Status" />
                <p className="text-sm text-gray-500">
                  Set the crew member's starting availability. They can update this themselves from their Staff Portal at any time.
                </p>

                <div className="space-y-3">
                  {AVAILABILITY_OPTIONS.map(({ value, label, desc }) => (
                    <label key={value}
                      className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        availability === value
                          ? 'border-[#0A1F44] bg-[#F4F7FB]'
                          : 'border-gray-100 bg-white hover:border-gray-200'
                      }`}>
                      <input type="radio" name="availability" value={value}
                        checked={availability === value}
                        onChange={() => setAvailability(value)}
                        className="accent-[#0A1F44] mt-0.5" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm text-[#0A1F44]">{label}</span>
                          <StatusBadge status={value} size="sm" />
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Summary before submit */}
                <div className="border-t border-gray-100 pt-5">
                  <SectionTitle icon={CheckCircle2} label="Review Summary" />
                  <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                    {[
                      { label: 'Name', value: name || '—' },
                      { label: 'Role', value: role ? STAFF_ROLE_LABELS[role] : '—' },
                      { label: 'Email', value: email || '—' },
                      { label: 'Phone', value: phone || '—' },
                      { label: 'License', value: fullLicense },
                      { label: 'Expires', value: licenseExpiry || '—' },
                      { label: 'Experience', value: `${yearsExp} year${yearsExp !== 1 ? 's' : ''}` },
                      { label: 'Availability', value: availability.replace('-', ' ') },
                    ].map(({ label, value }) => (
                      <div key={label} className="bg-[#F4F7FB] rounded-xl px-3 py-2.5">
                        <div className="text-xs text-gray-400 mb-0.5">{label}</div>
                        <div className="font-medium text-[#0A1F44] capitalize truncate">{value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className={`flex gap-3 mt-8 pt-5 border-t border-gray-100 ${step > 0 ? 'justify-between' : 'justify-end'}`}>
              {step > 0 && (
                <button onClick={() => setStep(s => s - 1)}
                  className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  disabled={!stepValid[step]}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm transition-all ${
                    stepValid[step]
                      ? 'bg-[#0A1F44] hover:bg-[#2E8FD8] text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}>
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={handleSubmit}
                  className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm transition-colors">
                  <CheckCircle2 className="w-4 h-4" /> Add Staff Member
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Live preview card ── */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-[#0A1F44] to-[#1a3a6e] px-5 py-4">
              <p className="text-xs text-white/50 uppercase tracking-widest mb-3">Live Preview</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#2E8FD8] flex items-center justify-center font-bold text-white text-lg shrink-0">
                  {name ? initials(name) : '??'}
                </div>
                <div className="min-w-0">
                  <div className="text-white font-semibold truncate">{name || 'Full Name'}</div>
                  <div className="text-white/60 text-sm">{role ? STAFF_ROLE_LABELS[role] : 'Role'} {yearsExp > 0 ? `· ${yearsExp}y exp.` : ''}</div>
                  <div className="mt-1.5">
                    <StatusBadge status={availability} size="sm" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-3 text-sm">
              <DetailRow icon={Mail} value={email || 'email@avion.com'} muted={!email} />
              <DetailRow icon={Phone} value={phone || '+1 555-0000'} muted={!phone} />
              <DetailRow icon={Shield} value={fullLicense} muted={!licenseNum} />
              {licenseExpiry && (
                <DetailRow icon={CalendarDays} value={`Expires ${licenseExpiry}`} muted={false} />
              )}
            </div>
          </div>

          {/* Step hints */}
          <div className="bg-[#EFF6FF] border border-blue-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-[#0A1F44] mb-2">
              {['Step 1 of 3', 'Step 2 of 3', 'Step 3 of 3'][step]}
            </p>
            <p className="text-xs text-gray-500 leading-relaxed">
              {[
                'Enter the crew member\'s name, email, role and contact details.',
                'Provide their regulatory license number. This is needed before any flight assignment can be made.',
                'Set their initial availability. Admins and staff can change this at any time.',
              ][step]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, label, optional }: { icon: React.ElementType; label: string; optional?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-7 h-7 bg-[#EFF6FF] rounded-lg flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-[#2E8FD8]" />
      </div>
      <span className="font-semibold text-[#0A1F44] text-sm">{label}</span>
      {optional && <span className="text-xs text-gray-400 ml-1">(optional)</span>}
    </div>
  );
}

function Required() {
  return <span className="text-red-400 ml-0.5">*</span>;
}

function DetailRow({ icon: Icon, value, muted }: { icon: React.ElementType; value: string; muted: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${muted ? 'text-gray-300' : 'text-gray-600'}`}>
      <Icon className="w-4 h-4 shrink-0 text-gray-400" />
      <span className="text-sm truncate">{value}</span>
    </div>
  );
}
