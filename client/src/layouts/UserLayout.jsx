import { Outlet } from 'react-router-dom';
import Navbar from '../components/user/Navbar';

const UserLayout = () => {
  return (
    <div className="min-h-screen bg-[#F7FAFC] dark:bg-slate-950">
      <Navbar />
      <main className="max-w-[1200px] mx-auto px-4 py-4">
        <Outlet />
      </main>
      <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 py-8 mt-10">
        <div className="max-w-[1200px] mx-auto px-4 text-center text-gray-500 dark:text-slate-400 text-sm">
          © 2026 Quikart. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
