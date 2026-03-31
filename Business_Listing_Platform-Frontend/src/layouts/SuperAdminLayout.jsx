import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { 
    LayoutDashboard, FolderTree, Building2, Users as UsersIcon, Settings, LogOut, MapPin,
    Package, Wrench, CalendarCheck, Star, Megaphone, Ticket, Zap,
    Shield, History, AlertOctagon, List, DollarSign, Receipt, RotateCcw, FileText,
    FileBarChart2, AlertCircle, Wallet, Monitor, BarChart3 as PerformanceIcon, Image as ImageIcon,
    MessageSquare, Search, Volume2, UserCheck, FileCheck, ShieldAlert
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import Logo from "../components/ui/Logo";

export default function SuperAdminLayout() {
    const { user, logout } = useAuth();
    const { settings } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };
    const navItems = [
        { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
        { label: "Users", path: "/admin/users", icon: UsersIcon },
        { label: "Listings", path: "/admin/listings", icon: List },
        { label: "Categories", path: "/admin/categories", icon: FolderTree },
        { label: "Products", path: "/admin/products", icon: Package },
        { label: "Services", path: "/admin/services", icon: Wrench },
        { label: "Reviews", path: "/admin/reviews", icon: Star },
        { label: "Leads", path: "/admin/leads", icon: Megaphone },
        { label: "Admin Team", path: "/admin/admins", icon: UserCheck },
        { label: "Roles", path: "/admin/roles", icon: Shield },
        { label: "Fraud", path: "/admin/fraud", icon: AlertOctagon },
        { label: "Audit Logs", path: "/admin/audit-logs", icon: History },
        { label: "Broadcasting", path: "/admin/broadcasts", icon: Volume2 },
        { label: "Claim Requests", path: "/admin/claims", icon: FileCheck },
        { label: "Locations", path: "/admin/locations", icon: MapPin },
        { label: "Plans", path: "/admin/plans", icon: Zap },
        { label: "Coupons", path: "/admin/coupons", icon: Ticket },
        { label: "Overrides", path: "/admin/subscriptions", icon: ShieldAlert },
        { label: "FAQs", path: "/admin/faqs", icon: MessageSquare },
        { label: "Settings", path: "/admin/settings", icon: Settings },
        { label: "Reports", path: "/admin/reports", icon: FileBarChart2 },
    ];

    const revenueNavItems = [
        { label: "Revenue Dashboard", path: "/admin/revenue", icon: DollarSign },
        { label: "Transactions", path: "/admin/revenue/transactions", icon: Receipt },
        { label: "Refund Queue", path: "/admin/revenue/refunds", icon: RotateCcw },
        { label: "Invoices", path: "/admin/revenue/invoices", icon: FileText },
        { label: "GST Report", path: "/admin/revenue/gst-report", icon: FileBarChart2 },
        { label: "Failed Payments", path: "/admin/revenue/failed-payments", icon: AlertCircle },
        { label: "Payouts", path: "/admin/revenue/payouts", icon: Wallet },
    ];

    const advertisementNavItems = [
        { label: "Ad Dashboard", path: "/admin/ads/analytics", icon: PerformanceIcon },
        { label: "Manage Ads", path: "/admin/ads", icon: ImageIcon },
        { label: "Ad Slot Config", path: "/admin/ads/slots", icon: Monitor },
    ];

    const cmsNavItems = [
        { label: "CMS Dashboard", path: "/admin/cms", icon: LayoutDashboard },
        { label: "Articles / Blogs", path: "/admin/cms/articles", icon: FileText },
        { label: "Static Pages", path: "/admin/cms/pages", icon: FileText },
        { label: "FAQ Manager", path: "/admin/cms/faqs", icon: MessageSquare },
        { label: "Home Banners", path: "/admin/cms/banners", icon: ImageIcon },
        { label: "SEO Blocks", path: "/admin/cms/seo", icon: Search },
        { label: "Media Library", path: "/admin/cms/media", icon: ImageIcon },
    ];

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
                <div className="h-16 flex items-center px-6 border-b border-slate-200">
                    <Logo 
                        settings={settings} 
                        className="h-8" 
                        imgClassName="max-w-[180px] object-contain"
                    />
                </div>

                <div className="flex-1 overflow-y-auto py-4">
                    <div className="px-4 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Super Admin
                    </div>
                    <nav className="flex-1 px-3 space-y-1">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* CMS & Content Section */}
                    <div className="px-4 mt-5 mb-2 text-xs font-semibold text-purple-500 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-3 h-3" /> CMS & Content
                    </div>
                    <nav className="flex-1 px-3 space-y-1">
                        {cmsNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-purple-50 text-purple-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Revenue & Finance Section */}
                    <div className="px-4 mt-5 mb-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
                        <DollarSign className="w-3 h-3" /> Revenue & Finance
                    </div>
                    <nav className="flex-1 px-3 space-y-1">
                        {revenueNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-indigo-50 text-indigo-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Advertisements Section */}
                    <div className="px-4 mt-5 mb-2 text-xs font-semibold text-emerald-500 uppercase tracking-wider flex items-center gap-2">
                        <Monitor className="w-3 h-3" /> Advertisements
                    </div>
                    <nav className="flex-1 px-3 space-y-1 pb-10">
                        {advertisementNavItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                    }`
                                }
                            >
                                <item.icon className="w-5 h-5" />
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                <div className="p-4 border-t border-slate-200">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-10">
                    <h1 className="text-xl font-semibold text-slate-800 hidden md:block">Administration</h1>
                    <div className="flex items-center gap-4 ml-auto">
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-semibold text-slate-900">{user?.name || 'Super Admin'}</span>
                            <span className="text-xs text-slate-500">{user?.email || 'admin@fuertedevelopers.in'}</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold border border-indigo-200">
                            SA
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
