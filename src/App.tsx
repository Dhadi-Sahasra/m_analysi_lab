/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Terminal, 
  Lock, 
  Bug, 
  ShieldAlert, 
  Info, 
  ShieldCheck, 
  Activity,
  ChevronRight,
  Menu,
  X,
  Database,
  Globe,
  HardDrive
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type ThreatType = 'RAT' | 'RANSOMWARE' | 'VIRUS' | 'OVERVIEW';

interface ThreatSection {
  id: ThreatType;
  title: string;
  icon: React.ElementType;
  color: string;
  summary: string;
  description: string;
  mechanism: string[];
  impact: string[];
  defense: string[];
  history: string;
  payloadMock?: string;
  simulationLogs?: string[]; // New field for real-time simulation
}

const THREAT_DATA: Record<Exclude<ThreatType, 'OVERVIEW'>, ThreatSection> = {
  RAT: {
    id: 'RAT',
    title: 'Remote Access Trojan (RAT)',
    icon: Globe,
    color: 'accent-rat',
    summary: 'A malware program that includes a back door for administrative control over the target computer.',
    description: 'RATs are usually downloaded invisibly with a user-requested program or sent as an email attachment. Once the host system is compromised, the intruder may use it to distribute RATs to other vulnerable computers and establish a botnet.',
    mechanism: [
      'Invisible background execution',
      'Keystroke logging (keyloggers)',
      'Remote webcam/microphone control',
      'File manipulation and extraction',
      'Screenshots and screen monitoring'
    ],
    impact: [
      'Theft of sensitive login credentials',
      'Personal privacy invasion',
      'Information espionage',
      'Persistence within corporate networks'
    ],
    defense: [
      'Use multi-factor authentication (MFA)',
      'Monitor for unusual outbound network traffic',
      'Disable unnecessary remote access ports',
      'Regularly scan for unauthorized background processes'
    ],
    history: 'Early RATs like NetBus and Back Orifice in the late 1990s demonstrated how simple graphical interfaces could be used to remotely hijack Windows systems.',
    payloadMock: `[SECTION: ENTRY_POINT]\n0x0010: FF AA 12 04 99 88 CC DD | init_syscall_bridge()\n0x0020: 00 00 1F 2E 4A 9C 00 11 | setup_remote_callback()\n0x0030: 9A BC DE F0 11 22 33 44 | listen(PORT: 8080)\n\n[SECTION: PERSISTENCE_LOGIC]\n# Mock logic for educational analysis\nIF system.uptime > 120s THEN:\n  WRITE_STUB "svchost_intel.exe" TO %APPDATA%\n  HOOK system_interrupt(0x21)`,
    simulationLogs: [
      "> [00:01] Connecting to C2 server at 45.33.22.11...",
      "> [00:03] Connection established. SSL/TLS AES-256 session active.",
      "> [00:05] Initializing persistence module...",
      "> [00:08] Identifying high-privilege process for injection: winlogon.exe",
      "> [00:12] VirtualAllocEx: Allocating buffer in target process (PID 484)...",
      "> [00:15] WriteProcessMemory: Injecting remote thread stub...",
      "> [00:18] CreateRemoteThread: Execution hijacked. Shell active.",
      "> [00:22] Activating keylogger hook: WH_KEYBOARD_LL",
      "> [00:25] Enumerating directory: C:/Users/%username%/Documents",
      "> [00:28] EXFILTRATION_START: Sending metadata to remote host...",
      "> [00:30] Simulation COMPLETE: Remote Administrative Control Established."
    ]
  },
  RANSOMWARE: {
    id: 'RANSOMWARE',
    title: 'Ransomware',
    icon: Lock,
    color: 'accent-ransom',
    summary: 'Malicious software designed to block access to a computer system or files until a sum of money is paid.',
    description: 'Modern ransomware uses robust asymmetric encryption to lock files. The perpetrator then demands a ransom, often in cryptocurrency, in exchange for the decryption key.',
    mechanism: [
      'File system scanning for high-value extensions (.docx, .jpg, .sql)',
      'Generation of asymmetric encryption keys',
      'Encryption of local and network-attached storage',
      'Persistence via registry keys or startup folders',
      'Display of ransom notification (HTML/Image)'
    ],
    impact: [
      'Complete loss of access to critical data',
      'Operational downtime and business disruption',
      'Significant financial loss (ransom + recovery costs)',
      'Reputational damage'
    ],
    defense: [
      'Maintain offline, air-gapped backups',
      'Implement "Least Privilege" access controls',
      'Endpoint Detection and Response (EDR) solutions',
      'User awareness training on phishing'
    ],
    history: 'The 2017 WannaCry attack impacted over 200,000 computers in 150 countries, proving how worm-like propagation can amplify ransomware damage.',
    payloadMock: `[SECTION: CRYPTO_CORE]\n0x0A2B: 3C F2 11 A0 FF 2E 99 CC | init_aes_256_stub()\n0x0A30: 48 65 6C 6C 6F 20 57 21 | key_derivation_process()\n\n[SECTION: ENCRYPTION_LOOP]\nFOR EACH doc IN FS_SEARCH_RESULTS:\n  IF doc.ext IN TARGET_FILE_TYPES:\n    STREAM_ENCRYPT(doc.path, RSA_PUBLIC_KEY)\n    RENAME(doc.path, doc.name + ".locked")`,
    simulationLogs: [
      "> [00:01] Scanning logical drives: C:\\ D:\\ Z:\\",
      "> [00:04] Discovered 4,281 target files (.docx, .pdf, .jpg, .sql)",
      "> [00:06] Executing vssadmin.exe delete shadows /all /quiet",
      "> [00:09] Initializing RSA-4096 key derivation process...",
      "> [00:12] Spinning up 16 parallel encryption threads...",
      "> [00:15] ENCRYPTING: C:\\Users\\Reports\\Q1_Financials.pdf -> .locked",
      "> [00:18] ENCRYPTING: D:\\Shared\\Project_X_Schematics.cad -> .locked",
      "> [00:22] Wiping original files using Guttman overwrite stub...",
      "> [00:26] Writing READ_ME_FOR_DECRYPT.txt to all directories...",
      "> [00:29] Launching GUI: 'YOUR FILES ARE ENCRYPTED' display.",
      "> [00:32] Simulation COMPLETE: File Access Terminal Restricted."
    ]
  },
  VIRUS: {
    id: 'VIRUS',
    title: 'Virus & Worms',
    icon: Bug,
    color: 'accent-virus',
    summary: 'Malware that attaches itself to another program and replicates when that program is executed.',
    description: 'While "virus" is often used broadly, a true virus requires user action to spread. A worm, by contrast, can propagate independently across networks by exploiting vulnerabilities.',
    mechanism: [
      'Code injection into legitimate executables (ELFs/EXEs)',
      'Macro exploitation in document formats',
      'Self-replication to removable media',
      'Modification of system boot sequences',
      'Scanning local subnet for unpatched vulnerabilities'
    ],
    impact: [
      'System corruption and instability',
      'Data erasure or modification',
      'Network congestion through rapid replication',
      'Hardware stress through high CPU utilization'
    ],
    defense: [
      'Keep Operating Systems and applications patched',
      'Use real-time antivirus/antimalware protection',
      'Disable Auto-Run for removable drives',
      'Scan all external file sources'
    ],
    history: 'The Creeper virus (1971) was one of the first experiments in self-replicating code, originally hopping between computers on the ARPANET.',
    payloadMock: `[SECTION: REPLICATION_WORM]\n0x1100: CC 1F 04 AA 98 FF 22 11 | scan_local_subnet()\n0x1110: 88 44 22 11 00 99 FA CE | attempt_exploit_smb_v1()\n\n[SECTION: PAYLOAD_INJECTION]\nFUNC inject_to_host(pid):\n  FOR EACH segment IN host_memory:\n    IF segment.is_executable:\n      WRITE(stub_shellcode, segment_offset)\n      JMP segment_offset`,
    simulationLogs: [
      "> [00:01] Hooking LdrLoadDll to monitor executable loading...",
      "> [00:04] Target found: powerpnt.exe (PID: 3912)",
      "> [00:06] Expanding PE header: Adding new segment '.worm_stub'",
      "> [00:09] Injecting polymorphic decryptor at entry point + 0x1A2",
      "> [00:12] Infecting host file system: 122 binaries modified.",
      "> [00:15] WORM_SCAN: Pinging subnet 192.168.1.0/24...",
      "> [00:18] VULNERABILITY_FOUND: 192.168.1.45 (SMBv1 MS17-010)",
      "> [00:22] Exploit attempted... Authentication Bypassed.",
      "> [00:25] Copying payload to \\\\192.168.1.45\\ADMIN$\\system32\\",
      "> [00:28] Remote execution triggered via WMI callback.",
      "> [00:30] Simulation COMPLETE: Network-Wide Propagation Simulated."
    ]
  }
};

export default function App() {
  const [currentView, setCurrentView] = useState<ThreatType>('OVERVIEW');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  
  // Simulation State
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationLines, setSimulationLines] = useState<string[]>([]);
  const [simulationProgress, setSimulationProgress] = useState(0);

  const selectedThreat = currentView !== 'OVERVIEW' ? THREAT_DATA[currentView] : null;

  const startSimulation = () => {
    if (!selectedThreat || !selectedThreat.simulationLogs) return;
    
    setIsSimulating(true);
    setSimulationLines([]);
    setSimulationProgress(0);
    
    let currentLine = 0;
    const logs = selectedThreat.simulationLogs;
    
    const interval = setInterval(() => {
      if (currentLine < logs.length) {
        setSimulationLines(prev => [...prev, logs[currentLine]]);
        currentLine++;
        setSimulationProgress((currentLine / logs.length) * 100);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsSimulating(false);
          // Keep the logs visible until user switch context or restart
        }, 3000);
      }
    }, 1200); // 1.2s per log line for 'real-time' feel
  };

  const handleContextChange = (view: ThreatType) => {
    setCurrentView(view);
    setIsSimulating(false);
    setSimulationLines([]);
    setSimulationProgress(0);
  };

  return (
    <div className="flex h-screen bg-[var(--bg-dark)] text-[var(--text-primary)] font-sans overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 240 : 80 }}
        className="bg-[var(--bg-panel)] border-r border-[var(--border)] flex flex-col z-50 shrink-0"
      >
        <div className="p-4 flex items-center justify-between border-b border-[var(--border)]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="text-[var(--accent-rat)] flex items-center gap-2">
              <Shield size={20} />
              {isSidebarOpen && (
                <span className="font-mono font-bold text-sm tracking-tighter whitespace-nowrap">SEC_LAB // v4.0</span>
              )}
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <div className="px-2 py-4">
            {isSidebarOpen && <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Threat Catalog</span>}
          </div>
          
          <NavItem 
            icon={<Activity size={18} />} 
            label="Overview" 
            active={currentView === 'OVERVIEW'} 
            collapsed={!isSidebarOpen}
            onClick={() => handleContextChange('OVERVIEW')}
            color="var(--accent-rat)"
          />
          
          {Object.values(THREAT_DATA).map((threat) => (
            <NavItem 
              key={threat.id}
              icon={<threat.icon size={18} />} 
              label={threat.id === 'VIRUS' ? 'Polymorphic Virus' : threat.title.split(' (')[0]} 
              active={currentView === threat.id} 
              collapsed={!isSidebarOpen}
              onClick={() => handleContextChange(threat.id)}
              color={`var(--${threat.color})`}
            />
          ))}

          {isSidebarOpen && (
            <div className="mt-auto pt-8">
              <div className="px-2 mb-2">
                <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Researcher Stats</span>
              </div>
              <div className="px-2 space-y-4">
                <div className="border-l border-[var(--accent-rat)] pl-3">
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Resolved</div>
                  <div className="text-sm font-bold font-mono">1,492_DET</div>
                </div>
                <div className="border-l border-blue-400 pl-3">
                  <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider">Uptime</div>
                  <div className="text-sm font-bold font-mono">99.98_%</div>
                </div>
              </div>
            </div>
          )}
        </nav>

        <div className="p-4 border-t border-[var(--border)]">
          <button 
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="w-full flex items-center gap-3 text-[var(--text-secondary)] hover:text-white transition-colors text-xs font-bold"
          >
            {isSidebarOpen ? <X size={16} /> : <Menu size={16} />}
            {isSidebarOpen && <span className="uppercase tracking-widest">Collapse View</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto bg-[var(--bg-dark)]">
        <header className="bg-[var(--bg-panel)] border-b border-[var(--border)] sticky top-0 px-6 py-4 flex justify-between items-center z-40">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-bold font-mono tracking-widest text-[var(--text-primary)] uppercase">
              {currentView === 'OVERVIEW' ? 'Node: SurveillanceDashboard' : `ThreatAnalysis: ${selectedThreat?.id}`}
            </h1>
          </div>
          <div className="status-badge text-[10px] bg-[rgba(74,177,97,0.1)] text-[var(--accent-virus)] px-3 py-1 rounded-full border border-[var(--accent-virus)] font-bold uppercase tracking-widest">
            Environment: Isolated Sandbox
          </div>
        </header>

        <div className="p-6 w-full max-w-[1200px] mx-auto">
          <AnimatePresence mode="wait">
            {currentView === 'OVERVIEW' ? (
              <motion.div 
                key="overview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Compact Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <StatCard 
                    icon={<Globe className="text-[var(--accent-rat)]" />} 
                    title="Risk Factor" 
                    value="CRITICAL" 
                    trend="0.88"
                    color="accent-rat"
                  />
                  <StatCard 
                    icon={<Lock className="text-[var(--accent-ransom)]" />} 
                    title="Asym Encryption" 
                    value="ACTIVE" 
                    trend="AES_256"
                    color="accent-ransom"
                  />
                  <StatCard 
                    icon={<Bug className="text-[var(--accent-virus)]" />} 
                    title="Replication" 
                    value="VOLATILE" 
                    trend="Worm_V1"
                    color="accent-virus"
                  />
                </div>

                <div className="bg-[var(--bg-panel)] border border-[var(--border)] p-6 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-l-4 border-l-[var(--accent-rat)]">
                  <div className="space-y-4">
                    <div className="text-[10px] font-bold text-[var(--accent-rat)] uppercase tracking-[0.3em]">Operational Readiness</div>
                    <h2 className="text-2xl font-bold font-sans uppercase tracking-tight">Vulnerability Intel Feed</h2>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
                      High-density analysis of malicious payloads for educational remediation. Monitor system calls, registry hooks, and network sockets in an isolated, secure kernel environment.
                    </p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setCurrentView('RAT')}
                        className="bg-[var(--bg-surface)] border border-[var(--border)] text-[var(--text-primary)] px-4 py-2 rounded text-[10px] font-bold uppercase tracking-widest hover:border-[var(--accent-rat)] transition-all"
                      >
                        Launch Analysis
                      </button>
                    </div>
                  </div>
                  <div className="bg-black/40 p-4 border border-[var(--border)] rounded font-mono text-[10px] text-emerald-400 space-y-1">
                    <div>[00:00:05] SYSTEM_INIT: SUCCESS</div>
                    <div>[00:00:12] SOCKET_LISTEN: 0.0.0.0:8080</div>
                    <div>[00:00:25] MEMORY_SCAN: COMPLETED (0 THREATS)</div>
                    <div className="animate-pulse">_</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.values(THREAT_DATA).map((threat) => (
                    <ActionCard 
                      key={threat.id}
                      threat={threat}
                      onClick={() => handleContextChange(threat.id)}
                    />
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="threat-detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-8 space-y-4">
                    {/* Compact Summary Header */}
                    <div className="bg-[var(--bg-panel)] border border-[var(--border)] p-5 rounded-lg border-l-4" style={{ borderColor: `var(--${selectedThreat?.color})` }}>
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">Intel Profile</span>
                          <h3 className="text-lg font-bold uppercase tracking-wider">{selectedThreat?.title}</h3>
                        </div>
                        <div className="text-[10px] font-mono leading-none flex gap-2">
                          <span className="text-[var(--text-secondary)]">ID:</span>
                          <span className="text-[var(--accent-rat)]">SH-2024-{selectedThreat?.id}</span>
                        </div>
                      </div>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {selectedThreat?.description}
                      </p>
                    </div>

                    {/* Payload Viewer - Focal Point */}
                    <div className="bg-[var(--bg-panel)] border border-[var(--border)] p-4 rounded-lg flex flex-col gap-3">
                      <div className="flex justify-between items-center px-1">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Data Stream Analysis</span>
                        <div className="flex items-center gap-4">
                           <div className="flex gap-2 text-[8px] font-bold px-2 py-0.5 border border-emerald-900/50 text-emerald-500 rounded uppercase">
                             <span className={isSimulating ? "animate-ping" : "animate-pulse"}>●</span> {isSimulating ? "Executing..." : "Non-Functional Output"}
                           </div>
                           {!isSimulating && (
                              <button 
                                onClick={startSimulation}
                                className="text-[10px] font-bold bg-[var(--accent-rat)] text-black px-3 py-1 rounded hover:opacity-85 active:scale-95 transition-all uppercase tracking-tighter"
                              >
                                {simulationLines.length > 0 ? "Restart Simulation" : "Simulate Execution"}
                              </button>
                           )}
                        </div>
                      </div>
                      <div className="bg-black border border-[#1a3a1a] rounded p-4 font-mono text-[11px] leading-relaxed text-[#88ff88] overflow-x-auto min-h-[250px] relative">
                         {isSimulating || simulationLines.length > 0 ? (
                           <div className="space-y-1">
                              {simulationLines.map((line, idx) => (
                                <motion.div 
                                  key={idx}
                                  initial={{ opacity: 0, x: -5 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="whitespace-pre-wrap"
                                >
                                  {line}
                                </motion.div>
                              ))}
                              {isSimulating && (
                                <div className="mt-4 h-1 bg-gray-800 rounded-full overflow-hidden w-48">
                                  <motion.div 
                                    className="h-full bg-emerald-500"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${simulationProgress}%` }}
                                    transition={{ duration: 0.5 }}
                                  />
                                </div>
                              )}
                           </div>
                        ) : (
                          <pre className="whitespace-pre-wrap opacity-60">
                            {selectedThreat?.payloadMock}
                          </pre>
                        )}
                        
                        {!isSimulating && simulationLines.length === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] group">
                             <button 
                                onClick={startSimulation}
                                className="bg-white/10 hover:bg-white/20 border border-white/20 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest transition-all hover:scale-105"
                             >
                               Start Virtual Simulation
                             </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 space-y-4">
                    {/* Mitigation Panel */}
                    <div className="bg-[rgba(74,177,97,0.05)] border border-[rgba(74,177,97,0.2)] p-5 rounded-lg flex flex-col gap-4">
                      <div className="flex items-center gap-2 text-[var(--accent-virus)]">
                        <ShieldCheck size={16} />
                        <h4 className="text-[10px] font-bold uppercase tracking-widest">Shield Strategy</h4>
                      </div>
                      <div className="space-y-4">
                        {selectedThreat?.defense.map((d, idx) => (
                          <div key={idx} className="flex gap-3 text-xs leading-normal">
                             <div className="text-[var(--text-secondary)] font-mono">{(idx + 1).toString().padStart(2, '0')}.</div>
                             <div className="text-[var(--text-secondary)]">{d}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Meta Card */}
                    <div className="bg-[var(--bg-panel)] border border-[var(--border)] p-5 rounded-lg space-y-4">
                       <div>
                         <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-1">Target Vector</div>
                         <div className="text-xs font-bold font-mono text-[var(--text-primary)]">NETWORK_SOCKETS // REG_HKLM</div>
                       </div>
                       <div>
                         <div className="text-[10px] text-[var(--text-secondary)] uppercase tracking-wider mb-1">Historical Origin</div>
                         <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed italic">
                           {selectedThreat?.history}
                         </p>
                       </div>
                       <button 
                        onClick={() => setCurrentView('OVERVIEW')}
                        className="w-full bg-[var(--bg-surface)] border border-[var(--border)] py-2 rounded text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] hover:text-white transition-all flex items-center justify-center gap-2"
                       >
                         <ChevronRight size={14} className="rotate-180" /> Return to Hub
                       </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
      
      <footer className="fixed bottom-0 left-0 right-0 bg-[var(--bg-panel)] border-t border-[var(--border)] px-4 py-2 flex justify-center items-center z-50 text-[10px] font-mono text-[var(--text-secondary)] uppercase tracking-widest gap-4">
        <span>© 2024 SECURITY-CORE LABORATORY</span>
        <span className="opacity-30">|</span>
        <span>Research Dataset V4.0.2</span>
        <span className="opacity-30">|</span>
        <span className="text-[var(--accent-ransom)]">Authorized Personnel Only</span>
      </footer>
    </div>
  );
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
  color: string;
}> = ({ icon, label, active, onClick, collapsed, color }) => {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-all duration-200 group relative border
        ${active ? 'bg-[rgba(242,125,38,0.05)] border-[var(--border)]' : 'border-transparent text-[var(--text-secondary)] hover:bg-[#1c1f26]'}
      `}
      style={{ borderColor: active ? color : undefined }}
    >
      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }}></div>
      <span className={`${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] group-hover:text-white'} transition-colors duration-200`}>
        {icon}
      </span>
      {!collapsed && (
        <span className={`text-[11px] font-bold uppercase tracking-wider whitespace-nowrap overflow-hidden transition-all duration-200`}>
          {label}
        </span>
      )}
    </button>
  );
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  color: string;
}> = ({ icon, title, value, trend }) => {
  return (
    <div className="bg-[var(--bg-surface)] p-4 rounded border border-[var(--border)] border-l-2 border-l-[var(--accent-rat)]">
      <div className="flex justify-between items-start mb-1">
        <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">{title}</span>
        <div className="p-1 opacity-50">{icon}</div>
      </div>
      <div>
        <p className="text-xl font-bold font-mono tracking-tight">{value}</p>
        <div className="flex items-center gap-2 mt-2">
          <div className="h-1 flex-1 bg-black/40 rounded-full overflow-hidden">
             <div className="h-full bg-[var(--accent-rat)] w-2/3"></div>
          </div>
          <span className="text-[9px] font-bold font-mono text-[var(--text-secondary)]">{trend}</span>
        </div>
      </div>
    </div>
  );
}

const ActionCard: React.FC<{
  threat: ThreatSection;
  onClick: () => void;
}> = ({ threat, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="bg-[var(--bg-panel)] p-5 rounded border border-[var(--border)] text-left hover:border-[var(--text-secondary)] transition-all group border-l-2"
      style={{ borderLeftColor: `var(--${threat.color})` }}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="text-[var(--text-primary)] opacity-50 group-hover:opacity-100 transition-opacity">
          <threat.icon size={18} />
        </div>
        <h4 className="text-[11px] font-bold uppercase tracking-widest">{threat.id}</h4>
      </div>
      <p className="text-[10px] text-[var(--text-secondary)] leading-relaxed mb-4 line-clamp-2">
        {threat.summary}
      </p>
      <div className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent-rat)] flex items-center gap-1 group-hover:gap-2 transition-all">
        Analyze Data <ChevronRight size={10} />
      </div>
    </button>
  );
}
