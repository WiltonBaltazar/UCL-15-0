import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Zap, RefreshCw, BarChart3, ChevronRight, Share2, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BackButton } from './components/BackButton';
import * as htmlToImage from 'html-to-image';
import type { GameState, Player, Formation, MatchResult } from './types';
import { FORMATIONS } from './data/formations';
import { PLAYERS } from './data/players';
import { SimulationEngine } from './engine';

export default function App() {
  const [gameState, setGameState] = useState<GameState>({
    status: 'START',
    mode: 'CLASSIC',
    formation: null,
    squad: Array(11).fill(null),
    results: [],
    leagueTable: [],
    currentStage: 'LEAGUE'
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<{ club: string; decade: string } | null>(null);
  const [activeRoster, setActiveRoster] = useState<Player[]>([]);
  const [selectedPlayerToAssign, setSelectedPlayerToAssign] = useState<Player | null>(null);
  const [rerolls, setRerolls] = useState({ club: 1, decade: 1 });

  const playSound = (type: 'spin' | 'lock' | 'click') => {
    const audio = new Audio(`/sounds/${type}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(() => {}); // Ignore autoplay blocks
  };

  const startDraft = (mode: 'CLASSIC' | 'BALL_KNOWLEDGE') => {
    playSound('click');
    setGameState(prev => ({ ...prev, status: 'FORMATION_SELECT', mode }));
  };

  const selectFormation = (formation: Formation) => {
    playSound('click');
    setGameState(prev => ({ 
      ...prev, 
      status: 'DRAFT', 
      formation,
      squad: Array(11).fill(null)
    }));
  };

  const spinSlots = () => {
    if (isSpinning || gameState.squad.every(p => p !== null)) return;
    setIsSpinning(true);
    setSelectedPlayerToAssign(null);
    playSound('spin');

    setTimeout(() => {
      const draftedIds = gameState.squad.filter(p => p !== null).map(p => p!.id);
      const draftedNames = gameState.squad.filter(p => p !== null).map(p => p!.name);
      
      // Get ALL valid combinations that have players remaining
      const availableCombos = PLAYERS.filter(p => !draftedIds.includes(p.id) && !draftedNames.includes(p.name)).reduce((acc: {club: string, decade: string}[], p) => {
        if (!acc.find(a => a.club === p.club && a.decade === p.decade)) {
          acc.push({ club: p.club, decade: p.decade });
        }
        return acc;
      }, []);

      if (availableCombos.length === 0) {
        setIsSpinning(false);
        return;
      }

      // Truly random selection from all valid combinations
      const randomIndex = Math.floor(Math.random() * availableCombos.length);
      const { club, decade } = availableCombos[randomIndex];
      
      setSpinResult({ club, decade });
      playSound('lock');

      const players = PLAYERS.filter(p => 
        p.club === club && 
        p.decade === decade && 
        !draftedIds.includes(p.id) &&
        !draftedNames.includes(p.name)
      );
      
      console.log(`Found ${players.length} players for ${club} (${decade})`);
      setActiveRoster(players);
      setIsSpinning(false);
    }, 1500);
  };

  const assignPlayerToSlot = (slotIndex: number) => {
    if (!selectedPlayerToAssign) return;
    
    // Prevent overwriting locked positions
    if (gameState.squad[slotIndex] !== null) return;
    
    const slotType = gameState.formation?.positions[slotIndex].type;
    if (!selectedPlayerToAssign.positions.includes(slotType!)) return;

    const newSquad = [...gameState.squad];
    newSquad[slotIndex] = selectedPlayerToAssign;
    
    setGameState(prev => ({ ...prev, squad: newSquad }));
    playSound('click');
    
    // Reset selection state to enforce "One player per spin"
    setActiveRoster([]);
    setSpinResult(null);
    setSelectedPlayerToAssign(null);
  };

  const [results, setResults] = useState<MatchResult[]>([]);

  const resetGame = () => {
    setGameState({
      status: 'START',
      mode: 'CLASSIC',
      formation: null,
      squad: Array(11).fill(null),
      results: [],
      leagueTable: [],
      currentStage: 'LEAGUE'
    });
    setResults([]);
    setSpinResult(null);
    setActiveRoster([]);
    setSelectedPlayerToAssign(null);
    setRerolls({ club: 1, decade: 1 });
  };

  const rerollClub = () => {
    if (rerolls.club > 0 && isSpinning === false && spinResult) {
      setRerolls(prev => ({ ...prev, club: prev.club - 1 }));
      setIsSpinning(true);
      setSelectedPlayerToAssign(null);
      playSound('spin');

      const currentDecade = spinResult.decade;
      const currentClub = spinResult.club;

      setTimeout(() => {
        const draftedIds = gameState.squad.filter(p => p !== null).map(p => p!.id);
        
        const validClubs = PLAYERS.filter(p => p.decade === currentDecade && !draftedIds.includes(p.id))
          .map(p => p.club);
        
        const uniqueClubs = Array.from(new Set(validClubs));
        
        // Force a change if possible
        let availableClubs = uniqueClubs.filter(c => c !== currentClub);
        if (availableClubs.length === 0) availableClubs = uniqueClubs;

        if (availableClubs.length === 0) {
          setIsSpinning(false);
          return;
        }

        const newClub = availableClubs[Math.floor(Math.random() * availableClubs.length)];
        setSpinResult({ club: newClub, decade: currentDecade });
        playSound('lock');

        const players = PLAYERS.filter(p => p.club === newClub && p.decade === currentDecade && !draftedIds.includes(p.id));
        setActiveRoster(players);
        setIsSpinning(false);
      }, 1000);
    }
  };

  const rerollDecade = () => {
    if (rerolls.decade > 0 && isSpinning === false && spinResult) {
      setRerolls(prev => ({ ...prev, decade: prev.decade - 1 }));
      setIsSpinning(true);
      setSelectedPlayerToAssign(null);
      playSound('spin');

      const currentClub = spinResult.club;
      const currentDecade = spinResult.decade;

      setTimeout(() => {
        const draftedIds = gameState.squad.filter(p => p !== null).map(p => p!.id);
        
        const validDecades = PLAYERS.filter(p => p.club === currentClub && !draftedIds.includes(p.id))
          .map(p => p.decade);
        
        const uniqueDecades = Array.from(new Set(validDecades));

        // Force a change if possible
        let availableDecades = uniqueDecades.filter(d => d !== currentDecade);
        if (availableDecades.length === 0) availableDecades = uniqueDecades;

        if (availableDecades.length === 0) {
          setIsSpinning(false);
          return;
        }

        const newDecade = availableDecades[Math.floor(Math.random() * availableDecades.length)] as any;
        setSpinResult({ club: currentClub, decade: newDecade });
        playSound('lock');

        const players = PLAYERS.filter(p => p.club === currentClub && p.decade === newDecade && !draftedIds.includes(p.id));
        setActiveRoster(players);
        setIsSpinning(false);
      }, 1000);
    }
  };

  const startSimulation = () => {
    setGameState(prev => ({ ...prev, status: 'SIMULATION' }));
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <AnimatePresence mode="wait">
        {gameState.status === 'START' && (
          <StartScreen onStart={startDraft} />
        )}
        {gameState.status === 'FORMATION_SELECT' && (
          <FormationSelect 
            onSelect={selectFormation} 
            onBack={() => setGameState(prev => ({ ...prev, status: 'START' }))}
          />
        )}
        {gameState.status === 'DRAFT' && (
          <DraftScreen
            gameState={gameState}
            isSpinning={isSpinning}
            spinResult={spinResult}
            activeRoster={activeRoster}
            selectedPlayer={selectedPlayerToAssign}
            rerolls={rerolls}
            onSpin={spinSlots}
            onPlayerClick={(p) => setSelectedPlayerToAssign(p === selectedPlayerToAssign ? null : p)}
            onSlotClick={assignPlayerToSlot}
            onRerollClub={rerollClub}
            onRerollDecade={rerollDecade}
            onBack={() => setGameState(prev => ({ ...prev, status: 'FORMATION_SELECT' }))}
            onStartSimulation={startSimulation}
          />

        )}
        {gameState.status === 'SIMULATION' && (
          <SimulationScreen 
            squad={gameState.squad as Player[]} 
            onComplete={(elimBy, winner) => setGameState(prev => ({ ...prev, status: 'RESULTS', eliminatedBy: elimBy, tournamentWinner: winner }))}
            results={results}
            setResults={setResults}
          />
        )}
        {gameState.status === 'RESULTS' && (
          <ResultsScreen 
            gameState={gameState} 
            results={results} 
            onReset={resetGame} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
function StartScreen({ onStart }: { onStart: (mode: 'CLASSIC' | 'BALL_KNOWLEDGE') => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="max-w-2xl w-full text-center flex flex-col items-center justify-center min-h-[80vh]"
    >
      <div className="flex justify-center mb-8">
        <div className="relative">
          <Trophy size={100} className="text-ucl-gold animate-pulse relative z-10" />
          <div className="absolute inset-0 bg-ucl-gold/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
        </div>
      </div>
      <h1 className="text-8xl font-black mb-6 tracking-tighter italic text-glow">15-0</h1>
      <p className="text-2xl text-slate-400 mb-12 max-w-lg leading-relaxed font-medium">Build an undefeated historical XI and conquer the modern UCL format.</p>
      
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md">
        <button 
          onClick={() => onStart('CLASSIC')}
          className="btn-primary flex-1 flex items-center justify-center gap-3"
        >
          <Zap size={20} /> Classic
        </button>
        <button 
          onClick={() => onStart('BALL_KNOWLEDGE')}
          className="flex-1 px-8 py-4 bg-slate-900/50 border-2 border-slate-700 rounded-full font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
        >
          <BarChart3 size={20} /> Ball Knowledge
        </button>
      </div>
    </motion.div>
  );
}

function FormationSelect({ onSelect, onBack }: { onSelect: (f: Formation) => void, onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl w-full mt-10 relative"
    >
      <BackButton onClick={onBack} />
      <h2 className="text-3xl font-bold mb-8 text-center">Select Your Formation</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FORMATIONS.map(f => (
          <div 
            key={f.name}
            onClick={() => onSelect(f)}
            className="neon-card cursor-pointer group"
          >
            <div className="h-40 bg-slate-800 rounded mb-4 relative overflow-hidden pitch-container">
              {f.positions.map((p: any) => (
                <div 
                  key={p.id}
                  className="absolute w-2 h-2 bg-ucl-neon rounded-full"
                  style={{ top: p.top, left: p.left, transform: 'translate(-50%, -50%)' }}
                />
              ))}
            </div>
            <h3 className="text-xl font-bold group-hover:text-ucl-neon transition-colors">{f.name}</h3>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function DraftScreen({ 
  gameState, 
  isSpinning, 
  spinResult, 
  activeRoster, 
  selectedPlayer,
  rerolls,
  onSpin, 
  onPlayerClick,
  onSlotClick,
  onRerollClub,
  onRerollDecade,
  onBack,
  onStartSimulation
}: { 
  gameState: GameState;
  isSpinning: boolean;
  spinResult: { club: string; decade: string } | null;
  activeRoster: Player[];
  selectedPlayer: Player | null;
  rerolls: { club: number; decade: number };
  onSpin: () => void;
  onPlayerClick: (p: Player) => void;
  onSlotClick: (idx: number) => void;
  onRerollClub: () => void;
  onRerollDecade: () => void;
  onBack: () => void;
  onStartSimulation: () => void;
}) {
  const isSquadFull = gameState.squad.every(p => p !== null);
  const draftedCount = gameState.squad.filter(player => player !== null).length;

  return (
    <div className="w-full max-w-7xl mt-4 space-y-6">
      <div className="relative overflow-hidden rounded-[28px] border border-slate-800/70 bg-slate-950/55 backdrop-blur-xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-slate-800/70">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-11 h-11 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/20 via-orange-500/10 to-transparent text-orange-300 flex items-center justify-center font-black text-sm shadow-[0_0_28px_rgba(249,115,22,0.18)] shrink-0">
              15-0
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-black tracking-tight text-white">Squad Draft</h2>
                <span className="rounded-full border border-slate-700 bg-slate-900/60 px-3 py-1 text-[11px] sm:text-xs font-black uppercase tracking-[0.22em] text-slate-400">
                  Draft {draftedCount}/11
                </span>
              </div>
              <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-slate-500 mt-1 truncate">
                {gameState.formation?.name ?? 'Select a formation'} · {gameState.mode.replace('_', ' ')}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-slate-300 hover:text-ucl-neon hover:border-ucl-neon/40 transition-colors font-black uppercase tracking-widest text-xs shadow-[0_8px_30px_rgba(0,0,0,0.15)]"
              aria-label="Go back"
            >
              <LogOut size={16} />
              Go Back
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-4 border-b border-slate-800/70">
          <div className="flex items-center gap-7 sm:gap-12 font-black text-[15px] sm:text-[17px] uppercase tracking-[0.18em]">
            <button
              type="button"
              onClick={onRerollClub}
              disabled={!spinResult || isSpinning || rerolls.club === 0}
              className="group flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <RefreshCw size={20} strokeWidth={2.35} className="text-amber-400 transition-transform group-hover:rotate-90" />
              <span>Team</span>
              <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-2 py-0.5 text-[10px] tracking-normal text-amber-300">
                {rerolls.club}
              </span>
            </button>
            <button
              type="button"
              onClick={onRerollDecade}
              disabled={!spinResult || isSpinning || rerolls.decade === 0}
              className="group flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-all disabled:opacity-35 disabled:cursor-not-allowed"
            >
              <RefreshCw size={20} strokeWidth={2.35} className="text-violet-400 transition-transform group-hover:-rotate-90" />
              <span>Era</span>
              <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-0.5 text-[10px] tracking-normal text-violet-300">
                {rerolls.decade}
              </span>
            </button>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-slate-500">
            <span>{draftedCount}/11 drafted</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start h-full relative">
        <div className="flex flex-col gap-4 w-full lg:w-[380px] shrink-0">
          <div className="rounded-[26px] border border-slate-800/80 bg-slate-950/45 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.28)] backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <span className="text-ucl-neon font-black tracking-widest uppercase text-xs">Squad Building</span>
              <span className="text-slate-500 font-bold text-xs">{draftedCount} / 11</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="flex flex-col gap-1.5">
                <div className="slot-machine-col flex items-center justify-center p-2 text-center h-28">
                  <AnimatePresence mode="wait">
                    {isSpinning ? (
                      <motion.div 
                        key="spinning"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.2 }}
                        className="text-sm font-bold text-slate-500"
                      >
                        ROLLING...
                      </motion.div>
                    ) : spinResult ? (
                      <motion.div 
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-base font-black text-ucl-neon text-glow uppercase leading-tight"
                      >
                        {spinResult.club}
                      </motion.div>
                    ) : (
                      <div className="text-slate-600 font-bold tracking-widest text-[8px] uppercase opacity-50 italic">???</div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="slot-machine-col flex items-center justify-center p-2 text-center h-28">
                  <AnimatePresence mode="wait">
                    {isSpinning ? (
                      <motion.div 
                        key="spinning-dec"
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 0.2, delay: 0.1 }}
                        className="text-sm font-bold text-slate-500"
                      >
                        ROLLING...
                      </motion.div>
                    ) : spinResult ? (
                      <motion.div 
                        initial={{ y: 15, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-xl font-black text-ucl-gold text-glow"
                      >
                        {spinResult.decade}
                      </motion.div>
                    ) : (
                      <div className="text-slate-600 font-bold tracking-widest text-[8px] uppercase opacity-50 italic">???</div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            <button 
              onClick={onSpin} 
              disabled={isSpinning || activeRoster.length > 0}
              className={`btn-primary w-full py-3 text-xs mb-4 ${isSpinning || activeRoster.length > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSpinning ? 'Simulating Era...' : 'Spin Slot Machine'}
            </button>

            <div className="space-y-2">
              <h4 className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2">Available Pool</h4>
              <div className="grid grid-cols-1 gap-1.5 max-h-[35vh] overflow-y-auto pr-1 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {activeRoster.length > 0 ? (
                    activeRoster.map(player => (
                      <motion.div 
                        key={player.id}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={() => onPlayerClick(player)}
                        className={`p-2.5 rounded-xl border cursor-pointer flex justify-between items-center transition-all duration-200 ${selectedPlayer?.id === player.id ? 'bg-ucl-neon text-ucl-dark border-white shadow-[0_0_18px_rgba(0,255,204,0.35)]' : 'bg-slate-900/90 border-slate-700/80 hover:border-ucl-neon/50 hover:bg-slate-800/95'}`}
                      >
                        <div className="min-w-0">
                          <div className="font-bold text-xs truncate">{player.name}</div>
                          <div className={`text-[9px] font-bold uppercase tracking-tighter ${selectedPlayer?.id === player.id ? 'text-ucl-dark/70' : 'text-slate-500'}`}>{player.positions.join(' / ')}</div>
                        </div>
                        {gameState.mode === 'CLASSIC' && (
                          <div className={`font-black text-base shrink-0 ml-2 ${selectedPlayer?.id === player.id ? 'text-ucl-dark' : 'text-ucl-gold'}`}>{player.rating}</div>
                        )}
                      </motion.div>
                    ))
                  ) : (
                    <div className="py-8 text-center border-2 border-dashed border-slate-800 rounded-xl text-slate-600 text-[10px] italic">
                      {isSpinning ? 'Fetching historical data...' : 'Spin the slots to reveal legendary players'}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {isSquadFull && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-ucl-neon/10 border border-ucl-neon/30 p-4 rounded-2xl backdrop-blur-sm">
              <h4 className="text-ucl-neon font-black tracking-widest uppercase text-[10px] mb-3">Draft Complete</h4>
              <button 
                onClick={onStartSimulation}
                className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2"
              >
                Start UCL Run <ChevronRight size={20} />
              </button>
            </motion.div>
          )}
        </div>

        <div className="flex-1 relative aspect-[3/4] rounded-[30px] overflow-hidden border border-slate-800/80 bg-gradient-to-b from-slate-900 to-slate-950 shadow-[0_22px_75px_rgba(0,0,0,0.35)] min-h-[450px] max-h-[75vh] w-full lg:max-w-md xl:max-w-lg mx-auto shrink-0 pitch-container">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 border-2 border-white rounded-full"></div>
          </div>
          
          {selectedPlayer && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 bg-ucl-neon text-ucl-dark px-3 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest z-30 shadow-2xl whitespace-nowrap"
            >
              Assign {selectedPlayer.name.split(' ').pop()} to {selectedPlayer.positions.join('/')}
            </motion.div>
          )}

          {gameState.formation?.positions.map((pos, idx) => {
            const player = gameState.squad[idx];
            const isValidForSelection = selectedPlayer?.positions.includes(pos.type);
            
            return (
              <motion.div 
                key={pos.id}
                onClick={() => onSlotClick(idx)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-20 ${selectedPlayer && !isValidForSelection ? 'opacity-30 pointer-events-none' : 'cursor-pointer'}`}
                style={{ top: pos.top, left: pos.left }}
              >
                <div className={`w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${player ? 'bg-ucl-neon border-white shadow-[0_0_15px_rgba(0,255,204,0.6)]' : isValidForSelection ? 'bg-white/20 border-ucl-neon border-dashed animate-pulse' : 'bg-slate-800 border-slate-600 hover:border-ucl-neon'}`}>
                  {player ? (
                    <div className="flex flex-col items-center">
                      <span className="text-ucl-dark font-black text-[8px] md:text-[10px] leading-none text-center px-1 truncate w-12 md:w-16">{player.name.split(' ').pop()}</span>
                      <span className="text-ucl-dark/70 font-bold text-[6px] md:text-[8px]">{player.rating}</span>
                    </div>
                  ) : (
                    <div className="text-center">
                      <span className={`text-[10px] md:text-sm font-black ${isValidForSelection ? "text-ucl-neon" : "text-slate-500"}`}>{pos.label}</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SimulationScreen({ squad, onComplete, results, setResults }: { squad: Player[], onComplete: (eliminatedBy?: string, winner?: string) => void, results: MatchResult[], setResults: React.Dispatch<React.SetStateAction<MatchResult[]>> }) {
  const [stage, setStage] = useState<'LEAGUE' | 'PLAYOFFS' | 'R16' | 'QF' | 'SF' | 'FINAL'>('LEAGUE');
  const [currentMatch, setCurrentMatch] = useState(0);
  const [isSimulating, setIsSimulating] = useState(true);
  const [isEliminated, setIsEliminated] = useState(false);

  useEffect(() => {
    if (isEliminated || !isSimulating) return;

    const runSim = async () => {
      if (stage === 'LEAGUE') {
        if (currentMatch < 8) {
          await new Promise(r => setTimeout(r, 800));
          const opponent = SimulationEngine.getLeagueOpponent(currentMatch);
          const res = SimulationEngine.simulateMatch(squad, opponent.name, opponent.rating, 'League');
          setResults(prev => [...prev, res]);
          setCurrentMatch(prev => prev + 1);
        } else {
          const wins = results.filter(r => r.isPlayerWin).length;
          if (wins >= 6) {
            setStage('R16');
            setCurrentMatch(0);
          } else if (wins >= 3) {
            setStage('PLAYOFFS');
            setCurrentMatch(0);
          } else {
            setIsEliminated(true);
            setTimeout(() => onComplete('League Standings', 'Real Madrid'), 2000);
          }
        }
      } else if (stage === 'PLAYOFFS' || stage === 'R16' || stage === 'QF' || stage === 'SF') {
        await new Promise(r => setTimeout(r, 1000));
        const opponent = { 
          name: stage === 'PLAYOFFS' ? 'Benfica' : stage === 'R16' ? 'AC Milan' : stage === 'QF' ? 'Bayern Munich' : 'Man City', 
          rating: stage === 'PLAYOFFS' ? 86 : stage === 'R16' ? 89 : stage === 'QF' ? 92 : 94 
        };
        
        // Use the new two-legged tie logic
        const tie = SimulationEngine.simulateTwoLeggedTie(
            squad,
            opponent.name,
            opponent.rating,
            true, // Assuming player is higher ranked for now
            stage
        );
        
        setResults(prev => [...prev, ...tie.results]);
        
        if (tie.isPlayerWin) {
          const nextStageMap: any = { PLAYOFFS: 'R16', R16: 'QF', QF: 'SF', SF: 'FINAL' };
          setStage(nextStageMap[stage]);
        } else {
          setIsEliminated(true);
          // Helper to get aggregate score
          const aggP = tie.results.reduce((acc, match) => acc + (match.isPlayerWin ? match.homeScore : match.awayScore), 0);
          const aggO = tie.results.reduce((acc, match) => acc + (match.isPlayerWin ? match.awayScore : match.homeScore), 0);
          const elimDetail = `${opponent.name} (Agg: ${aggP}-${aggO})`;
          setTimeout(() => onComplete(elimDetail, 'Man City'), 2000);
        }
      } else if (stage === 'FINAL') {
        await new Promise(r => setTimeout(r, 1500));
        const finalOpponent = 'Real Madrid';
        const res = SimulationEngine.simulateMatch(squad, finalOpponent, 96, 'Final');
        setResults(prev => [...prev, res]);
        
        const isWinner = res.isPlayerWin || (res.homeScore === res.awayScore && Math.random() > 0.5);
        
        setIsSimulating(false);
        setTimeout(() => onComplete(isWinner ? undefined : finalOpponent, isWinner ? 'Your Squad' : finalOpponent), 3000);
      }
    };

    runSim();
  }, [currentMatch, stage, isEliminated]);

  return (
    <div className="max-w-2xl w-full mt-10">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-black tracking-widest uppercase text-ucl-neon">{stage.replace('_', ' ')}</h2>
        {isEliminated && <p className="text-red-500 font-bold mt-2">KNOCKED OUT!</p>}
      </div>
      
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {results.map((m, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 rounded-lg border flex flex-col gap-1 text-sm ${m.isPlayerWin ? 'bg-green-900/20 border-green-800' : (m.homeScore === m.awayScore && !m.penaltyOutcome) ? 'bg-slate-800/50 border-slate-700' : 'bg-red-950/40 border-red-800'}`}
          >
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500 uppercase font-bold w-16">{m.stage}</span>
              <span className="flex-1 text-right pr-4 font-bold">{m.homeTeam}</span>
              <span className="bg-slate-900 px-3 py-1 rounded font-black text-ucl-neon border border-slate-700">{m.homeScore} - {m.awayScore}</span>
              <span className="flex-1 text-left pl-4 font-bold">{m.awayTeam}</span>
            </div>
            {m.penaltyOutcome && (
              <div className="text-center text-[10px] uppercase font-bold text-slate-300 mt-1 border-t border-slate-700 pt-1">
                {m.penaltyOutcome.playerWin ? 'Won' : 'Lost'} on Penalties ({m.penaltyOutcome.homePenalties} - {m.penaltyOutcome.awayPenalties})
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {isSimulating && !isEliminated && (
        <div className="flex justify-center items-center gap-3 text-ucl-neon mt-10 animate-pulse">
          <RefreshCw className="animate-spin" />
          <span className="font-bold tracking-widest text-xs">SIMULATING FIXTURES...</span>
        </div>
      )}
    </div>
  );
}

function ResultsScreen({ gameState, results, onReset }: { gameState: GameState, results: MatchResult[], onReset: () => void }) {
  const resultRef = useRef<HTMLDivElement>(null);
  const wins = results.filter(r => r.isPlayerWin).length;
  const isWinner = results.some(r => r.stage === 'Final' && r.isPlayerWin);
  const squadRating = Math.round(gameState.squad.reduce((acc, p) => acc + (p?.rating || 0), 0) / 11);
  const finalMatch = results.find(r => r.stage === 'Final');

  const downloadScreenshot = async () => {
    if (resultRef.current) {
      try {
        const dataUrl = await htmlToImage.toPng(resultRef.current);
        const link = document.createElement('a');
        link.download = '15-0-result.png';
        link.href = dataUrl;
        link.click();
      } catch (error) {
        console.error('Error generating screenshot:', error);
      }
    }
  };

  return (
    <motion.div 
      ref={resultRef}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-4xl w-full text-center mt-10 pb-20 bg-ucl-dark p-8 rounded-3xl"
    >
      <div className="mb-8">
        {isWinner ? (
          <div className="flex flex-col items-center">
            <Trophy size={80} className="text-ucl-gold mb-4" />
            <h2 className="text-5xl font-black text-ucl-neon mb-2">CHAMPIONS!</h2>
            {finalMatch && (
              <div className="bg-slate-900 px-6 py-2 rounded-xl border border-ucl-neon/30 text-ucl-neon font-black text-xl mt-2">
                Final: {finalMatch.homeScore} - {finalMatch.awayScore}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <Zap size={60} className="text-slate-500 mb-4" />
            <h2 className="text-4xl font-black mb-2 uppercase">Knocked Out</h2>
            <div className="bg-red-950/20 border border-red-900/50 px-6 py-3 rounded-2xl mb-4">
              <p className="text-red-400 font-bold text-sm">Eliminated by: <span className="text-white uppercase tracking-widest">{gameState.eliminatedBy}</span></p>
            </div>
            <p className="text-slate-400 text-sm">Tournament Winner: <span className="text-ucl-gold font-bold">{gameState.tournamentWinner}</span></p>
          </div>
        )}
      </div>

      <div className="flex flex-row gap-4 mb-8 justify-center">
        <button onClick={downloadScreenshot} className="btn-primary flex-1 max-w-[200px] flex items-center justify-center gap-3 py-3">
          <Share2 size={18} /> Share
        </button>
        <button onClick={onReset} className="flex-1 max-w-[200px] px-8 py-3 bg-slate-800 rounded-full font-bold hover:bg-slate-700 transition-colors">
          Play Again
        </button>
      </div>

      {/* Tournament Summary moved above */}
      <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8 max-w-2xl mx-auto">
        <h3 className="text-slate-300 font-bold mb-4 uppercase text-sm">Tournament Summary</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-black text-white">{results.length}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Matches</div>
          </div>
          <div>
            <div className="text-2xl font-black text-green-500">{wins}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Wins</div>
          </div>
          <div>
            <div className="text-2xl font-black text-red-500">{results.length - wins}</div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest">Losses/Draws</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pitch Visualization */}
        <div className="neon-card text-left p-6">
          <h3 className="text-ucl-neon font-bold mb-6 uppercase text-sm">Tactical Setup: {gameState.formation?.name}</h3>
          <div className="relative aspect-[3/4] bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-700">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 border border-white rounded-full"></div>
            </div>
            {gameState.formation?.positions.map((pos, idx) => {
              const player = gameState.squad[idx];
              return (
                <div 
                  key={pos.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  style={{ top: pos.top, left: pos.left }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${player ? 'bg-ucl-neon border-white' : 'bg-slate-700 border-slate-600'}`}>
                    {player ? (
                      <span className="text-ucl-dark font-black text-[8px] truncate w-8 text-center">{player.name.split(' ').pop()}</span>
                    ) : (
                      <span className="text-[6px] font-bold text-slate-500">{pos.label}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Drafted Player List */}
        <div className="neon-card text-left p-6">
          <h3 className="text-ucl-neon font-bold mb-6 uppercase text-sm">Drafted Squad</h3>
          <div className="grid grid-cols-1 gap-2 mb-6">
            {gameState.squad.map((p, i) => (
              <div key={i} className="text-xs bg-slate-800 p-3 rounded border border-slate-700 flex justify-between items-center">
                <span className="font-bold truncate">{p?.name}</span>
                <span className="text-ucl-gold font-black">{p?.rating}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
            <span className="text-slate-400 font-bold uppercase text-[10px]">Team Rating</span>
            <span className="text-3xl font-black text-ucl-gold">{squadRating}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
