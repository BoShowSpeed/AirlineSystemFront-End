import { useApp } from '../context/AppContext';
import PilotPortal from './staff/PilotPortal';
import CopilotPortal from './staff/CopilotPortal';
import CabinCrewPortal from './staff/CabinCrewPortal';
import ManagerPortal from './staff/ManagerPortal';
import TechnicianPortal from './staff/TechnicianPortal';

export default function StaffPortal() {
  const { user, staffMembers } = useApp();

  const staffMember = staffMembers.find(s => s.email === user?.email);

  if (!staffMember) {
    // Fallback: use first pilot record for demo
    const fallback = staffMembers.find(s => s.role === 'pilot') ?? staffMembers[0];
    return <PilotPortal staffMember={fallback} />;
  }

  switch (staffMember.role) {
    case 'pilot':      return <PilotPortal staffMember={staffMember} />;
    case 'copilot':    return <CopilotPortal staffMember={staffMember} />;
    case 'cabin_crew': return <CabinCrewPortal staffMember={staffMember} />;
    case 'manager':    return <ManagerPortal staffMember={staffMember} />;
    case 'technician': return <TechnicianPortal staffMember={staffMember} />;
  }
}
