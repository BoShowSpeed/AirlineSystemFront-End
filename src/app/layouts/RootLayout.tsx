import { Outlet } from 'react-router';
import { Navbar } from '../components/Navbar';

export function RootLayout() {
  return (
    <div className="min-h-screen bg-[#F4F7FB]">
      <Navbar />
      <Outlet />
    </div>
  );
}
