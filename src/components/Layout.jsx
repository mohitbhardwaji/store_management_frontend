import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Home, ClipboardPlus, Plane, Calendar, ClipboardList, User, LogOut, Menu, ChevronLeft, Receipt, Package, ShoppingCart, FileText, Box } from 'lucide-react';
import coolLogo from '../assets/coolzone.png'
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { apiServerUrl } from "../constant/constants";

export default function Layout() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [billCount, setBillCount] = useState(0);
    const [person, setPerson] = useState({ name: '', email: '' , role:''});
    const navigate = useNavigate();
    const location = useLocation();
    const role = ['owner', 'accounts', 'admin']
    const baseNavItems = [
        { name: 'Dashboard', to: '/dashboard', icon: <Home size={22} />, roles: role },
        { name: 'Inventory', to: '/products', icon: <Package size={22} />, roles: role },
        { name: 'Forms', to: '/cart', icon: <ShoppingCart size={22} /> },
        { name: 'Bills', to: '/billing', icon: <FileText size={22} />, badge: billCount },
        // { name: 'Stock', to: '/stock', icon: <Box size={22} />, roles: role },
    ];
    
    const navItems = baseNavItems.filter(item => {
        if (!item.roles) return true; 
        return item.roles.includes(person.role); 
    });
    

    useEffect(() => {

        const data = localStorage.getItem('person');
        if (data) setPerson(JSON.parse(data));

        const fetchBills = async () => {
            try {
              const token = localStorage.getItem('token');
              const res = await axios.get(`${apiServerUrl}/bill`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              setBillCount(res.data.total);
            } catch (err) {
              console.error('Failed to fetch bills:', err);
            }
          };
      
          fetchBills();
    }, []);

    const toggleSidebar = () => {
        if (window.innerWidth < 768) {
            setMobileOpen(!mobileOpen);
        } else {
            setCollapsed(!collapsed);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('person');
        navigate('/login');
    };

    const truncate = (str, maxLength) => str?.length > maxLength ? str.slice(0, maxLength) + '...' : str;

    const SidebarContent = ({ closeMobile = () => { } }) => (
        <>
            <div className="flex items-center justify-center p-4 mb-4 text-white text-xl text-meduim">
                {/* {!collapsed &&} */}
                <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-800">
                    {collapsed ? <Menu size={20} /> :  <img src={coolLogo} alt="COOLZONE" className="h-20 object-contain" />}
                </button>
            </div>

            <nav className="space-y-2 px-3 mt-4">
                {navItems.map(({ name, to, icon, badge, dot }) => {
                    const isActive = location.pathname === to;
                    return (
                        <button
                            key={to}
                            onClick={() => {
                                navigate(to);
                                if (window.innerWidth < 768) closeMobile();
                            }}
                            className={`flex items-center w-full px-3 py-4 rounded-lg transition ${isActive ? 'bg-blue-400 text-white' : 'text-gray-700 hover:bg-blue-300'
                                } ${collapsed ? 'justify-center' : ''}`}
                        >
                            {icon}
                            {!collapsed && (
                                <div className="flex items-center  justify-between w-full ml-2">
                                    <span className='text-xl'>{name}</span>
                                    {badge && <span className={`ml-auto text-l ${isActive ? 'bg-gray-300 text-gray-700':'bg-blue-400 text-white'} rounded-full px-2`}>{badge}</span>}
                                </div>
                            )}
                            {dot && !collapsed && <span className="ml-auto w-2 h-2 bg-red-500 rounded-full" />}
                        </button>
                    );
                })}
            </nav>

            <div className="p-3 mt-auto flex items-center justify-between bg-blue-300 rounded-xl mx-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full">
                        <User size={20} className="text-blue-600" />
                    </div>
                    {!collapsed && (
                        <div>
                            <div className="text-sm font-medium text-blue-600">{person?.name}</div>
                            <div className="text-xs text-gray-600">{truncate(person?.email, 15)}</div>
                        </div>
                    )}
                </div>
                <LogOut size={18} className="text-red-600 hover:text-red-800 cursor-pointer" onClick={handleLogout} />
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Desktop Sidebar */}
            <aside className={`hidden md:flex flex-col justify-between fixed top-0 left-0 h-full bg-[#D4EAFD] bg-opacity-55 transition-all duration-300 z-10 ${collapsed ? 'w-20' : 'w-64'}`}>
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            {mobileOpen && (
                <aside className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden">
                    <div className="bg-blue-50 w-64 h-full shadow-lg p-4 flex flex-col justify-between">
                        <SidebarContent closeMobile={() => setMobileOpen(false)} />
                    </div>
                </aside>
            )}

            {/* Main Content */}
            <main
    className={`flex-1 min-h-screen transition-all duration-300 overflow-y-auto`}
    style={{ marginLeft: window.innerWidth >= 768 ? (collapsed ? '5rem' : '16rem') : '0' }}
>
    {/* Mobile Topbar */}
    <div className="md:hidden p-4 bg-[#94989a] shadow flex items-center">
        <button onClick={toggleSidebar}>
            <Menu size={24} className="text-white" />
        </button>
        <img
    src={coolLogo} // replace with your actual logo path
    alt="Company Logo"
    className="ml-4 h-8 w-auto"
  />
    </div>

    <div className="p-4 pb-2">
        <Outlet />
    </div>
</main>
        </div>
    );
}
