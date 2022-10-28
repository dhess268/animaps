import { Outlet } from 'react-router-dom';
import Header from './Header'; // ⚠️ verify it's the correct path

const Layout = () => (
  <>
    <Header />
    <Outlet />
  </>
);

export default Layout;
