import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminApi } from '../services/api';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  GraduationCap, 
  Wrench, 
  FolderGit2, 
  Briefcase, 
  Award, 
  Trophy, 
  FileDown, 
  Mail, 
  Share2, 
  BookOpen, 
  Palette, 
  Search as SearchIcon, 
  BarChart3, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink, 
  Database,
  ChevronRight
} from 'lucide-react';

export type TabKey = 
  | 'overview'
  | 'profile'
  | 'about'
  | 'education'
  | 'skills'
  | 'projects'
  | 'experience'
  | 'certifications'
  | 'achievements'
  | 'resume'
  | 'contact'
  | 'socials'
  | 'blog'
  | 'appearance'
  | 'seo'
  | 'analytics'
  | 'account';

interface LayoutProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  children: React.ReactNode;
}

interface NavItem {
  id: TabKey;
  label: string;
  icon: React.FC<{ className?: string }>;
  badge?: number;
  badgeLabel?: string;
}

export const Layout: React.FC<LayoutProps> = ({ activeTab, onTabChange, children }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [searchFilter, setSearchFilter] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // Fetch unread count & user profile avatar
  useEffect(() => {
    const fetchBadge = async () => {
      try {
        const stats = await adminApi.getDashboardOverview();
        if (stats && typeof stats.unreadMessages === 'number') {
          setUnreadCount(stats.unreadMessages);
        }
      } catch {
        // silent fallback
      }
    };

    const fetchAvatar = async () => {
      try {
        const prof = await adminApi.getProfile();
        if (prof?.avatarUrl) {
          const fullUrl = prof.avatarUrl.startsWith('http')
            ? prof.avatarUrl
            : `http://localhost:5000${prof.avatarUrl.startsWith('/') ? '' : '/'}${prof.avatarUrl}`;
          setAvatarUrl(fullUrl);
        }
      } catch {
        // silent fallback
      }
    };

    fetchBadge();
    fetchAvatar();
    const interval = setInterval(fetchBadge, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { group: string; items: NavItem[] }[] = [
    {
      group: 'Core Management',
      items: [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'about', label: 'About Narrative', icon: FileText },
        { id: 'education', label: 'Education', icon: GraduationCap },
        { id: 'skills', label: 'Skills Matrix', icon: Wrench },
        { id: 'projects', label: 'Projects & Flagship', icon: FolderGit2 },
      ]
    },
    {
      group: 'Experience & Credentials',
      items: [
        { id: 'experience', label: 'Experience (Empty)', icon: Briefcase, badgeLabel: '0 Active' },
        { id: 'certifications', label: 'Certifications', icon: Award },
        { id: 'achievements', label: 'Achievements', icon: Trophy },
        { id: 'resume', label: 'Resume Files', icon: FileDown },
      ]
    },
    {
      group: 'Engagement & Content',
      items: [
        { id: 'contact', label: 'Contact Messages', icon: Mail, badge: unreadCount },
        { id: 'socials', label: 'Social Profiles', icon: Share2 },
        { id: 'blog', label: 'Blog & Articles', icon: BookOpen },
      ]
    },
    {
      group: 'Settings & Telemetry',
      items: [
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'seo', label: 'SEO Settings', icon: SearchIcon },
        { id: 'analytics', label: 'Analytics Telemetry', icon: BarChart3 },
        { id: 'account', label: 'Account & Security', icon: ShieldCheck },
      ]
    }
  ];

  const currentItem = navItems.flatMap(g => g.items).find(i => i.id === activeTab);

  return (
    <div className="flex h-screen bg-[#080d16] text-slate-100 overflow-hidden font-sans">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-[#0b121e] border-r border-slate-800/80 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-72'
        } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-400 to-sky-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/25 flex-shrink-0">
              <ShieldCheck className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="font-bold tracking-tight text-white flex items-center gap-1.5 text-sm">
                  <span>Amit Chauhan</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">CMS</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono truncate">localhost:3001 &bull; Private</div>
              </div>
            )}
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Input */}
        {!collapsed && (
          <div className="px-3 pt-3">
            <div className="relative">
              <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text"
                placeholder="Filter navigation (17)..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full bg-[#10192a] border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>
        )}

        {/* Nav List */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4 custom-scrollbar">
          {navItems.map((group, gIdx) => {
            const filteredItems = group.items.filter(item => 
              item.label.toLowerCase().includes(searchFilter.toLowerCase())
            );
            if (filteredItems.length === 0) return null;

            return (
              <div key={gIdx} className="space-y-1">
                {!collapsed && (
                  <div className="px-2 text-[10px] font-mono uppercase tracking-wider text-slate-500">
                    {group.group}
                  </div>
                )}
                <div className="space-y-0.5">
                  {filteredItems.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onTabChange(item.id);
                          setSidebarOpen(false);
                        }}
                        title={collapsed ? item.label : undefined}
                        className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-amber-500/15 text-amber-200 border border-amber-400/40 shadow-sm shadow-amber-950/40 font-semibold'
                            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                        } ${collapsed ? 'justify-center' : ''}`}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                          {!collapsed && <span className="truncate">{item.label}</span>}
                        </div>
                        {!collapsed && (
                          <div className="flex items-center gap-1.5">
                            {item.badge !== undefined && item.badge > 0 && (
                              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950 animate-pulse">
                                {item.badge}
                              </span>
                            )}
                            {item.badgeLabel && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-slate-800 text-slate-400 border border-slate-700/60">
                                {item.badgeLabel}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-[#080d16] space-y-2">
          {!collapsed && (
            <div className="flex items-center justify-between px-2 py-1 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span className="font-mono text-emerald-400 text-[10px]">DB ACTIVE</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">PostgreSQL 5432</span>
            </div>
          )}

          {/* User Pill with Live Profile Photo & Logout */}
          <div className="flex items-center justify-between gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800/80">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="relative group shrink-0">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-amber-400/60 bg-space-950 flex items-center justify-center text-amber-300 font-bold text-xs shadow-sm shadow-amber-500/20">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Amit Chauhan" className="w-full h-full object-cover" />
                  ) : (
                    <span>{user?.name ? user.name[0].toUpperCase() : 'A'}</span>
                  )}
                </div>
              </div>
              {!collapsed && (
                <div className="truncate">
                  <div className="text-xs font-semibold text-slate-100 truncate">{user?.name || 'Amit Chauhan'}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{user?.email || 'amitchn28@gmail.com'}</div>
                </div>
              )}
            </div>
            <button
              onClick={logout}
              title="Sign Out (Terminates session)"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-16 bg-[#0b121e]/85 backdrop-blur-md border-b border-slate-800/80 flex items-center justify-between px-4 sm:px-6 z-10 flex-shrink-0">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-500 font-mono">localhost:3001</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              <span className="font-semibold text-amber-300">{currentItem?.label || activeTab}</span>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex items-center space-x-3">
            {/* Database indicator */}
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400 font-mono">
              <Database className="w-3 h-3 text-emerald-400" />
              <span>Postgres Prisma v6</span>
            </div>

            {/* Unread Message Pill */}
            <button
              onClick={() => onTabChange('contact')}
              className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title={`${unreadCount} Unread Messages`}
            >
              <Mail className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#0b121e] animate-pulse" />
              )}
            </button>

            {/* Public Portfolio Link */}
            <a
              href="http://localhost:3000"
              target="_blank"
              rel="noreferrer"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors"
            >
              <span>View Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </header>

        {/* View Content Body */}
        <main className="flex-1 overflow-y-auto bg-[#080d16] p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
