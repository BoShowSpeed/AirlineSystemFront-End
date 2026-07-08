import { createBrowserRouter } from 'react-router';
import { RootLayout } from './layouts/RootLayout';
import { AdminLayout } from './layouts/AdminLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Landing from './pages/Landing';
import SearchResults from './pages/SearchResults';
import AuthPage from './pages/AuthPage';
import PassengerDashboard from './pages/PassengerDashboard';
import SeatSelection from './pages/SeatSelection';
import BookingPayment from './pages/BookingPayment';
import BoardingPass from './pages/BoardingPass';
import AdminDashboard from './pages/admin/AdminDashboard';
import FlightManagement from './pages/admin/FlightManagement';
import CrewStaff from './pages/admin/CrewStaff';
import AircraftMaintenance from './pages/admin/AircraftMaintenance';
import StaffPortal from './pages/StaffPortal';
import StaffAvailability from './pages/StaffAvailability';
import ChangePassword from './pages/ChangePassword';
import AddStaff from './pages/admin/AddStaff';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: RootLayout,
    children: [
      // Public
      { index: true, Component: Landing },
      { path: 'search', Component: SearchResults },
      { path: 'auth', Component: AuthPage },

      // Passenger-only booking area
      { path: 'dashboard', element: <ProtectedRoute roles={['passenger']}><PassengerDashboard /></ProtectedRoute> },
      { path: 'seat-selection', element: <ProtectedRoute roles={['passenger']}><SeatSelection /></ProtectedRoute> },
      { path: 'booking', element: <ProtectedRoute roles={['passenger']}><BookingPayment /></ProtectedRoute> },
      { path: 'boarding-pass', element: <ProtectedRoute roles={['passenger']}><BoardingPass /></ProtectedRoute> },

      // Any authenticated user
      { path: 'change-password', element: <ProtectedRoute><ChangePassword /></ProtectedRoute> },

      // Staff-only area
      { path: 'staff', element: <ProtectedRoute roles={['staff']}><StaffPortal /></ProtectedRoute> },
      { path: 'staff/availability', element: <ProtectedRoute roles={['staff']}><StaffAvailability /></ProtectedRoute> },
    ],
  },
  {
    path: '/admin',
    // Guard the whole admin section; children render inside AdminLayout's <Outlet>.
    element: <ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, Component: AdminDashboard },
      { path: 'flights', Component: FlightManagement },
      { path: 'crew', Component: CrewStaff },
      { path: 'crew/add', Component: AddStaff },
      { path: 'aircraft', Component: AircraftMaintenance },
    ],
  },
]);
