import { Outlet } from 'react-router-dom';

export default function OutletThing() {
  return (
    <div>
      hi <Outlet />
    </div>
  );
}
