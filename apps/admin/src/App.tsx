import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Login } from './components/Login';
import { Layout, TabKey } from './components/Layout';
import { Loader2 } from 'lucide-react';

// Views
import { OverviewView } from './views/OverviewView';
import { ProfileView } from './views/ProfileView';
import { AboutView } from './views/AboutView';
import { EducationView } from './views/EducationView';
import { SkillsView } from './views/SkillsView';
import { ProjectsView } from './views/ProjectsView';
import { ExperienceView } from './views/ExperienceView';
import { CertificationsView } from './views/CertificationsView';
import { AchievementsView } from './views/AchievementsView';
import { ResumeView } from './views/ResumeView';
import { ContactView } from './views/ContactView';
import { SocialsView } from './views/SocialsView';
import { BlogView } from './views/BlogView';
import { AppearanceView } from './views/AppearanceView';
import { SeoView } from './views/SeoView';
import { AnalyticsView } from './views/AnalyticsView';
import { AccountView } from './views/AccountView';

const AdminApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-slate-300">
        <div className="relative mb-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center animate-pulse">
            <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
          </div>
        </div>
        <div className="text-sm font-semibold tracking-wide text-white">Amit Chauhan CMS</div>
        <div className="text-xs text-slate-500 font-mono mt-1">Verifying encrypted admin session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView onNavigate={(tab) => setActiveTab(tab as TabKey)} />;
      case 'profile':
        return <ProfileView />;
      case 'about':
        return <AboutView />;
      case 'education':
        return <EducationView />;
      case 'skills':
        return <SkillsView />;
      case 'projects':
        return <ProjectsView />;
      case 'experience':
        return <ExperienceView />;
      case 'certifications':
        return <CertificationsView />;
      case 'achievements':
        return <AchievementsView />;
      case 'resume':
        return <ResumeView />;
      case 'contact':
        return <ContactView />;
      case 'socials':
        return <SocialsView />;
      case 'blog':
        return <BlogView />;
      case 'appearance':
        return <AppearanceView />;
      case 'seo':
        return <SeoView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'account':
        return <AccountView />;
      default:
        return <OverviewView onNavigate={(tab) => setActiveTab(tab as TabKey)} />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActiveView()}
    </Layout>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <AdminApp />
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
