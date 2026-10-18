import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AgentStatusBoard from '@/components/command/AgentStatusBoard';
import AgentOrgChart from '@/components/command/AgentOrgChart';
import ActivityLog from '@/components/command/ActivityLog';
import RoadmapTracker from '@/components/command/RoadmapTracker';
import ProtocolDoctrine from '@/components/command/ProtocolDoctrine';

type TabId = 'topology' | 'agents' | 'activity' | 'roadmap' | 'protocol';

export default function CommandCenter() {
  const [activeTab, setActiveTab] = useState<TabId>('activity');
  const [phase, setPhase] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const hasAccess = sessionStorage.getItem('captains-key');
    if (!hasAccess) {
      sessionStorage.setItem('captains-key', 'true');
    }
  }, [navigate]);

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 200);
    const t2 = setTimeout(() => setPhase(2), 600);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const tabs: { id: TabId; label: string }[] = [
    { id: 'activity', label: 'Activity' },
    { id: 'topology', label: 'Topology' },
    { id: 'agents', label: 'Agents' },
    { id: 'roadmap', label: 'Roadmap' },
    { id: 'protocol', label: 'Protocol' },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header
        className="border-b border-border px-4 md:px-10 py-4 flex items-center justify-between gap-3 transition-all duration-700"
        style={{ opacity: phase >= 1 ? 1 : 0 }}
      >
        <div className="flex items-center gap-3 md:gap-6 min-w-0">
          <button
            onClick={() => navigate('/')}
            className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground hover:text-foreground transition-colors shrink-0"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            ← Manifesto
          </button>
          <div className="w-px h-4 bg-border shrink-0" />
          <h1
            className="text-base md:text-lg font-normal tracking-[-0.01em] truncate"
            style={{ fontFamily: "'EB Garamond', Georgia, serif" }}
          >
            Command Center
          </h1>
        </div>
        <div className="flex items-center gap-2 md:gap-3 shrink-0">
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: 'hsl(160 40% 45%)' }}
          />
          <span
            className="hidden sm:inline text-[10px] tracking-[0.2em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'hsl(160 30% 45%)' }}
          >
            Systems Online
          </span>
          <span
            className="sm:hidden text-[9px] tracking-[0.15em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'hsl(160 30% 45%)' }}
          >
            Online
          </span>
        </div>
      </header>

      {/* Tab navigation */}
      <nav
        aria-label="Command Center"
        className="border-b border-border px-4 md:px-10 flex gap-0 overflow-x-auto transition-all duration-700"
        style={{ opacity: phase >= 1 ? 1 : 0 }}
      >
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="relative px-4 md:px-5 py-3 text-sm transition-colors duration-300 shrink-0"
            style={{
              fontFamily: "'Instrument Sans', sans-serif",
              color: activeTab === tab.id ? 'hsl(40 10% 82%)' : 'hsl(40 4% 35%)',
            }}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div
                className="absolute bottom-0 left-0 right-0 h-px"
                style={{ background: 'hsl(25 30% 45%)' }}
              />
            )}
          </button>
        ))}
        <a
          href="/localcheck/index.html"
          className="relative px-4 md:px-5 py-3 text-sm text-muted-foreground hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] shrink-0"
          style={{ fontFamily: "'Instrument Sans', sans-serif" }}
        >
          LocalCheck
        </a>
      </nav>

      {/* Content */}
      <div
        className="px-4 md:px-10 py-6 md:py-8 transition-all duration-700"
        style={{
          opacity: phase >= 2 ? 1 : 0,
          transform: phase >= 2 ? 'translateY(0)' : 'translateY(12px)',
        }}
      >
        {activeTab === 'topology' && <AgentOrgChart />}
        {activeTab === 'agents' && <AgentStatusBoard />}
        {activeTab === 'activity' && <ActivityLog />}
        {activeTab === 'roadmap' && <RoadmapTracker />}
        {activeTab === 'protocol' && <ProtocolDoctrine />}
      </div>
    </div>
  );
}
