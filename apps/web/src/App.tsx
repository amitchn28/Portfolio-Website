import React, { useState, useEffect } from 'react';
import { DynamicBackground } from './components/DynamicBackground';
import { CustomCursor } from './components/CustomCursor';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Education } from './components/Education';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { Profiles } from './components/Profiles';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { 
  portfolioApi, 
  FALLBACK_PROFILE, 
  FALLBACK_EDUCATION, 
  FALLBACK_SKILLS, 
  FALLBACK_PROJECTS, 
  FALLBACK_SOCIALS 
} from './services/api';

const PortfolioInner: React.FC = () => {
  const { theme, siteSettings } = useTheme();
  const [profile, setProfile] = useState<any>(FALLBACK_PROFILE);
  const [education, setEducation] = useState<any[]>(FALLBACK_EDUCATION);
  const [skills, setSkills] = useState<any[]>(FALLBACK_SKILLS);
  const [projects, setProjects] = useState<any[]>(FALLBACK_PROJECTS);
  const [socials, setSocials] = useState<any[]>(FALLBACK_SOCIALS);
  const [resumeOpen, setResumeOpen] = useState(false);

  // Fetch dynamic data from PostgreSQL API on mount
  useEffect(() => {
    portfolioApi.recordEvent('PAGE_VIEW', '/');

    async function loadPortfolioData() {
      try {
        const [profData, eduData, skillsData, projData, socData] = await Promise.allSettled([
          portfolioApi.getProfile(),
          portfolioApi.getEducation(),
          portfolioApi.getSkills(),
          portfolioApi.getProjects(),
          portfolioApi.getSocialLinks(),
        ]);

        if (profData.status === 'fulfilled' && profData.value) {
          setProfile(profData.value);
        }
        if (eduData.status === 'fulfilled' && Array.isArray(eduData.value) && eduData.value.length > 0) {
          setEducation(eduData.value);
        }
        if (skillsData.status === 'fulfilled' && Array.isArray(skillsData.value) && skillsData.value.length > 0) {
          const val = skillsData.value as any;
          if (val[0]?.skills) {
            const flattened: any[] = [];
            val.forEach((catGroup: any) => {
              (catGroup.skills || []).forEach((s: any) => {
                flattened.push({
                  ...s,
                  category: catGroup.name,
                });
              });
            });
            if (flattened.length > 0) setSkills(flattened);
          } else {
            setSkills(val);
          }
        }
        if (projData.status === 'fulfilled' && Array.isArray(projData.value) && projData.value.length > 0) {
          setProjects(projData.value);
        }
        if (socData.status === 'fulfilled' && Array.isArray(socData.value) && socData.value.length > 0) {
          setSocials(socData.value);
        }
      } catch (err) {
        console.warn('API sync fallback active:', err);
      }
    }

    loadPortfolioData();
  }, []);

  return (
    <div data-theme={theme.id} className="relative min-h-screen bg-[#070b16] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-black">
      {/* Interactive Precision HUD Cursor */}
      <CustomCursor />

      {/* Dynamic Fluid Animated Background (Replaces Static Stars) */}
      <DynamicBackground />

      {/* Maintenance Mode Banner (When toggled in Admin CMS) */}
      {siteSettings?.isMaintenance && (
        <div className="relative z-50 bg-amber-500 text-slate-950 px-4 py-2 text-center text-xs font-bold font-mono tracking-wide shadow-md">
          ⚠️ MAINTENANCE NOTICE: System upgrades in progress. Preview mode active.
        </div>
      )}

      {/* Floating Pill Navigation */}
      <Navbar />

      {/* Main Page Layout */}
      <main className="relative z-10 space-y-12 sm:space-y-16">
        <Hero profileData={profile} onOpenResume={() => setResumeOpen(true)} />
        <About profileData={profile} />
        <Education educationList={education} />
        <Projects projectsList={projects} />
        <Skills skillsList={skills} />
        <Profiles profileData={profile} socialsList={socials} />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Resume Modal */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
        resumeUrl={profile?.resumeUrl}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <PortfolioInner />
    </ThemeProvider>
  );
};

export default App;
