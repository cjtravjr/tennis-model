import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { MOCK_MATCHES, Matchup, ModelPick } from './data/mockMatches';
import { cn } from './lib/utils';
import { CreditCard, Settings, LogOut, ChevronLeft, ChevronDown, Calculator, Trophy, Search } from 'lucide-react';

type TourFilter = 'All' | 'ATP' | 'WTA' | 'Challenger';
type MarketFilter = 'All Markets' | 'Moneyline' | 'Spread' | 'Total';

function parseTimeMinutes(t: string): number {
  const match = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!match) return 0;
  let [, h, m, p] = match;
  let hours = parseInt(h);
  const minutes = parseInt(m);
  if (p.toUpperCase() === 'PM' && hours !== 12) hours += 12;
  if (p.toUpperCase() === 'AM' && hours === 12) hours = 0;
  // Push late-night matches (12:00 AM - 4:59 AM) to the bottom of the current day's slate
  if (hours < 5) hours += 24;
  return hours * 60 + minutes;
}

function formatOdds(odds: number) {
  if (odds > 0) return `+${odds}`;
  return odds.toString();
}

const MarketEdgeCard: React.FC<{ title: string; pick: ModelPick }> = ({ title, pick }) => {
  return (
    <div className="bg-white rounded-sm border border-black/5 p-4 shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <span className="text-xs uppercase tracking-widest text-secondary font-medium">{title}</span>
        <span className={cn("text-xs font-medium", pick.ev > 0 ? "text-sage" : "text-rose")}>
          {pick.ev > 0 ? '+' : ''}{pick.ev.toFixed(1)}% EV
        </span>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-secondary uppercase mb-1">Pick</span>
          <span className="font-medium text-charcoal tabular-nums">{pick.valueLabel}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-secondary uppercase mb-1">Confidence</span>
          <span className="font-medium text-charcoal tabular-nums">{pick.confidence}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-secondary uppercase mb-1">True Odds</span>
          <span className="font-medium text-charcoal tabular-nums">{formatOdds(pick.trueOdds)}</span>
        </div>
      </div>
    </div>
  );
}

const InsightsTab = ({ match }: { match: Matchup }) => {
  const p1Spread = match.odds.spread.p1Value > 0 ? `+${match.odds.spread.p1Value}` : match.odds.spread.p1Value;
  const p2Spread = match.odds.spread.p2Value > 0 ? `+${match.odds.spread.p2Value}` : match.odds.spread.p2Value;
  
  // Deterministic mock values based on name length to give variety
  const p1Rate = 45 + ((match.player1.name.length * 13) % 35);
  const p2Rate = 45 + ((match.player2.name.length * 17) % 35);
  const p1Wins = Math.round((p1Rate / 100) * 20);
  const p2Wins = Math.round((p2Rate / 100) * 20);

  const matchTotal = match.odds.total.value;
  const p1OverRate = 35 + ((match.player1.name.length * 11) % 45);
  const p2OverRate = 35 + ((match.player2.name.length * 19) % 45);
  const p1OverWins = Math.round((p1OverRate / 100) * 30);
  const p2OverWins = Math.round((p2OverRate / 100) * 30);

  return (
    <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
      
      {/* Surface Form */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[11px] uppercase tracking-widest text-secondary font-medium">Surface Form ({match.surface})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-black/5 p-5 shadow-sm rounded-sm">
            <div className="text-sm font-medium mb-4 text-charcoal">{match.player1.name}</div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-secondary">Last 5 on {match.surface}</span>
              <div className="flex gap-1">
                {match.player1.recentForm.map((res, i) => (
                  <span key={i} className={cn("text-[10px] w-[22px] h-[22px] flex items-center justify-center rounded-[3px] font-medium", res === 'W' ? "bg-sage/15 text-sage" : "bg-rose/10 text-rose")}>{res}</span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-black/5">
              <span className="text-xs text-secondary">Current Tournament</span>
              <span className="text-xs font-medium text-charcoal tabular-nums">3-0 (Sets: 6-1)</span>
            </div>
          </div>
          
          <div className="bg-white border border-black/5 p-5 shadow-sm rounded-sm">
            <div className="text-sm font-medium mb-4 text-charcoal">{match.player2.name}</div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs text-secondary">Last 5 on {match.surface}</span>
              <div className="flex gap-1">
                {match.player2.recentForm.map((res, i) => (
                  <span key={i} className={cn("text-[10px] w-[22px] h-[22px] flex items-center justify-center rounded-[3px] font-medium", res === 'W' ? "bg-sage/15 text-sage" : "bg-rose/10 text-rose")}>{res}</span>
                ))}
              </div>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-black/5">
              <span className="text-xs text-secondary">Current Tournament</span>
              <span className="text-xs font-medium text-charcoal tabular-nums">3-0 (Sets: 6-2)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Line Clearance */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[11px] uppercase tracking-widest text-secondary font-medium">Market Trends (Spread)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-black/5 p-5 shadow-sm rounded-sm">
            <div className="flex justify-between items-center mb-5">
              <span className="text-sm font-medium text-charcoal">{match.player1.name}</span>
              <span className="text-xs px-2 py-0.5 bg-black/5 text-charcoal rounded-sm tabular-nums font-medium tracking-wide">{p1Spread}</span>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-secondary">Line Clearance (Last 20)</span>
                  <span className={cn("font-medium", p1Rate >= 50 ? "text-sage" : "text-rose")}>{p1Rate}% ({p1Wins}-{20-p1Wins})</span>
                </div>
                <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
                  <div className={cn("h-full", p1Rate >= 50 ? "bg-sage" : "bg-rose")} style={{ width: `${p1Rate}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-[11px] pt-3 border-t border-black/5">
                <span className="text-secondary">When favored</span>
                <span className="font-medium text-charcoal">{(p1Rate - 5)}% ({Math.max(0, p1Wins - 1)}-{20-p1Wins+1})</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-black/5 p-5 shadow-sm rounded-sm">
            <div className="flex justify-between items-center mb-5">
              <span className="text-sm font-medium text-charcoal">{match.player2.name}</span>
              <span className="text-xs px-2 py-0.5 bg-black/5 text-charcoal rounded-sm tabular-nums font-medium tracking-wide">{p2Spread}</span>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-secondary">Line Clearance (Last 20)</span>
                  <span className={cn("font-medium", p2Rate >= 50 ? "text-sage" : "text-rose")}>{p2Rate}% ({p2Wins}-{20-p2Wins})</span>
                </div>
                <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden">
                  <div className={cn("h-full", p2Rate >= 50 ? "bg-sage" : "bg-rose")} style={{ width: `${p2Rate}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-[11px] pt-3 border-t border-black/5">
                <span className="text-secondary">As underdog</span>
                <span className="font-medium text-charcoal">{(p2Rate + 5)}% ({Math.min(20, p2Wins + 1)}-{Math.max(0, 20-p2Wins-1)})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Game Totals */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[11px] uppercase tracking-widest text-secondary font-medium">Market Trends (Game Totals)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white border border-black/5 p-5 shadow-sm rounded-sm">
            <div className="flex justify-between items-center mb-5">
              <span className="text-sm font-medium text-charcoal">{match.player1.name}</span>
              <span className="text-xs px-2 py-0.5 bg-black/5 text-charcoal rounded-sm tabular-nums font-medium tracking-wide">O/U {matchTotal}</span>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-secondary">Over Hit Rate (Last 30)</span>
                  <span className={cn("font-medium", p1OverRate >= 50 ? "text-sage" : "text-rose")}>{p1OverRate}% ({p1OverWins}-{30-p1OverWins})</span>
                </div>
                <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden flex">
                  <div className={cn("h-full", p1OverRate >= 50 ? "bg-sage" : "bg-rose")} style={{ width: `${p1OverRate}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-[11px] pt-3 border-t border-black/5">
                <span className="text-secondary">Under Hit Rate</span>
                <span className="font-medium text-charcoal">{100 - p1OverRate}% ({30-p1OverWins}-{p1OverWins})</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-black/5 p-5 shadow-sm rounded-sm">
            <div className="flex justify-between items-center mb-5">
              <span className="text-sm font-medium text-charcoal">{match.player2.name}</span>
              <span className="text-xs px-2 py-0.5 bg-black/5 text-charcoal rounded-sm tabular-nums font-medium tracking-wide">O/U {matchTotal}</span>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-secondary">Over Hit Rate (Last 30)</span>
                  <span className={cn("font-medium", p2OverRate >= 50 ? "text-sage" : "text-rose")}>{p2OverRate}% ({p2OverWins}-{30-p2OverWins})</span>
                </div>
                <div className="w-full bg-black/5 h-1.5 rounded-full overflow-hidden flex">
                  <div className={cn("h-full", p2OverRate >= 50 ? "bg-sage" : "bg-rose")} style={{ width: `${p2OverRate}%` }} />
                </div>
              </div>
              <div className="flex justify-between text-[11px] pt-3 border-t border-black/5">
                <span className="text-secondary">Under Hit Rate</span>
                <span className="font-medium text-charcoal">{100 - p2OverRate}% ({30-p2OverWins}-{p2OverWins})</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const PlayerStatsSection = ({ match }: { match: Matchup }) => {
  const [activeDataset, setActiveDataset] = useState<'Vs All' | 'H2H' | 'Event'>('Vs All');
  
  const vsAllStats = [
    ["64.29% (432/240)", "YTD Win/Loss", "56.90% (598/453)"],
    ["62.30% (960/581)", "Sets Win/Loss", "55.73% (1313/1043)"],
    ["54.64% (7894/6554)", "Games Win/Loss", "52.29% (11150/10173)"],
    ["0.42", "Aces Per Game", "0.13"],
    ["2965", "Aces Total", "1300"],
    ["0.21", "Double Faults Per Game", "0.18"],
    ["1485", "Total Double Faults", "1856"],
    ["1:19:57", "Average Match Time", "1:21:19"],
    ["387.96", "Average Opponent Rank", "524.44"],
    ["63% (26296/41646)", "1st Serve %", "66% (33194/50122)"],
    ["69% (18027/26296)", "1st Serve Win %", "62% (20463/33194)"],
    ["48% (7351/15333)", "2nd Serve Win %", "46% (7773/16925)"],
    ["44% (2188/4977)", "Break Pts Won % (Total)", "47% (2768/5912)"],
    ["44% (18652/42876)", "Return Points Win %", "44% (22116/49793)"],
    ["65% (428/660)", "Best of 3 Sets Win %", "57% (589/1029)"],
    ["25% (1/4)", "Best of 5 Sets Win %", "67% (2/3)"],
    ["58% (105/181)", "Tiebreaks Win % (Total)", "54% (112/207)"],
    ["52% (106/202)", "Deciding Set Win %", "54% (147/270)"],
    ["86% (437/378)", "1st Set Won, Won Match", "89% (591/528)"],
    ["13% (437/58)", "1st Set Won, Lost Match", "10% (591/62)"],
    ["23% (235/53)", "1st Set Lost, Won Match", "15% (460/69)"]
  ];

  const h2hStats = [
    ["3", "H2H Matches Won", "5"],
    ["8", "Sets Won", "10"],
    ["87", "Games Won", "86"],
    ["33", "Aces (Total)", "3"],
    ["15", "Total Double Faults", "21"],
    ["1:15:40", "Average Match Time", "1:15:40"],
    ["62% (298/479)", "1st Serve %", "66% (311/468)"],
    ["69% (207/298)", "1st Serve Win %", "63% (197/311)"],
    ["49% (88/181)", "2nd Serve Win %", "52% (81/157)"],
    ["48% (22/46)", "Break Pts Won %", "40% (17/43)"],
    ["41% (190/468)", "Return Points Win %", "38% (184/479)"],
    ["38% (3/8)", "Best‑of‑3 Win %", "63% (5/8)"],
    ["0% (0/2)", "Deciding Set Win %", "100% (2/2)"],
    ["60% (3/5)", "1st Set Won, Won Match", "100% (3/3)"],
    ["40% (2/5)", "1st Set Won, Lost Match", "0% (0/3)"],
    ["0% (0/3)", "1st Set Lost, Won Match", "40% (2/5)"]
  ];

  const eventStats = [
    ["1", "Matches Played", "1st Match"],
    ["1:17:29", "Last Match Time", "1st Match"],
    ["1:17:29", "Total Time", "1st Match"],
    ["0.78", "Aces Per Game", "1st Match"],
    ["7", "Total Aces", "1st Match"],
    ["0.11", "Double Faults Count", "1st Match"],
    ["1", "Total Double Faults", "1st Match"],
    ["61% (27/44)", "First Serve", "1st Match"],
    ["93% (25/27)", "1st Serve Win %", "1st Match"],
    ["65% (11/17)", "2nd Serve Win %", "1st Match"],
    ["75% (3/4)", "Break Points Converted", "1st Match"],
    ["0% (0/0)", "Break Points Saved", "1st Match"],
    ["100% (9/9)", "Service Hold %", "1st Match"],
    ["67% (6/9)", "Opponent Hold %", "1st Match"],
    ["41% (21/51)", "Return Points Win %", "1st Match"],
    ["60.00% (57/95)", "Total Points Won", "1st Match"],
    ["0% (0/0)", "Tiebreak Win %", "1st Match"],
    ["0% (0/0)", "Deciding Set Win %", "1st Match"],
    ["0.00", "Tiebreaks Per Match", "1st Match"],
    ["100% (1/1)", "1st Set Won, Won Match", "1st Match"],
    ["0% (0/0)", "1st Set Lose Count %", "1st Match"]
  ];

  const currentStats = activeDataset === 'Vs All' ? vsAllStats : activeDataset === 'H2H' ? h2hStats : eventStats;

  return (
    <div className="flex flex-col gap-5 pt-8 border-t border-black/5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-[11px] uppercase tracking-widest text-secondary font-medium shrink-0">Statistical Breakdown</h3>
        
        {/* Segmented Control */}
        <div className="flex p-0.5 bg-black/[0.04] rounded shadow-inner border border-black/5 shrink-0 self-start md:self-auto max-w-full overflow-x-auto scrollbar-hide">
          {(['Vs All', 'H2H', 'Event'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveDataset(tab)}
              className={cn(
                "px-4 py-1.5 text-[11px] uppercase tracking-widest rounded-[3px] font-medium transition-all whitespace-nowrap",
                activeDataset === tab 
                  ? "bg-white text-charcoal shadow-sm border border-black/5" 
                  : "text-secondary hover:text-charcoal border border-transparent"
              )}
            >
              {tab === 'Event' ? 'Current Event' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Bubbles */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mt-1">
        {['Year: 2026', 'Surface: All', 'Rounds: All', 'Tour: All Levels'].map((filter, i) => (
          <button 
            key={i} 
            className="flex shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-full border border-black/10 bg-white shadow-sm text-[11px] font-medium text-charcoal hover:border-black/20 hover:bg-black/[0.02] transition-all whitespace-nowrap"
          >
            {filter}
            <ChevronDown className="w-3 h-3 text-secondary" />
          </button>
        ))}
      </div>

      {/* Data Table */}
      <div className="border border-black/5 bg-white shadow-sm overflow-hidden rounded animate-in fade-in duration-300">
        <div className="grid grid-cols-3 bg-black/[0.02] border-b border-black/5 p-3 text-xs uppercase tracking-wider text-secondary font-medium text-center items-center">
            <div className="text-left font-medium text-charcoal text-[13px] capitalize truncate px-2">{match.player1.name}</div>
            <div className="hidden sm:block">Stat Category</div>
            <div className="sm:hidden">Stat</div>
            <div className="text-right font-medium text-charcoal text-[13px] capitalize truncate px-2">{match.player2.name}</div>
        </div>
        <div className="flex flex-col divide-y divide-black/5">
          {currentStats.map((row, idx) => (
            <div key={idx} className="grid grid-cols-3 p-3 lg:px-5 hover:bg-black/[0.01] transition-colors items-center gap-4">
                <div className="text-left font-medium text-charcoal text-xs sm:text-[13px]">{row[0]}</div>
                <div className="text-center text-secondary text-[10px] sm:text-[11px] uppercase tracking-wider">{row[1]}</div>
                <div className="text-right font-medium text-charcoal text-xs sm:text-[13px]">{row[2]}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

function MatchDetailPanel({ match, onClose }: { match: Matchup, onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<'Edge' | 'Players' | 'Insights'>('Edge');
  const picks = [
    { title: "Moneyline", pick: match.modelPicks.moneyline },
    { title: "Spread", pick: match.modelPicks.spread },
    { title: "Total", pick: match.modelPicks.total },
  ];

  return (
    <>
      <div className="flex flex-col gap-6 shrink-0">
        <button 
          onClick={onClose} 
          className="flex items-center gap-1 text-secondary hover:text-charcoal text-[11px] font-medium uppercase tracking-widest cursor-pointer transition-colors w-fit -ml-1"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Slate
        </button>
        
        <div className="flex flex-col">
          <span className="text-[10px] text-secondary uppercase tracking-widest mb-1">Match Details</span>
          <h2 className="text-3xl lg:text-4xl font-light leading-tight">
            {match.player1.name} <span className="text-secondary tracking-wide text-xl lg:text-2xl mx-2">vs</span> {match.player2.name}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-6 border-b border-black/5 shrink-0 mt-4 relative">
        {(['Edge', 'Players', 'Insights'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-3 text-xs uppercase tracking-widest transition-colors cursor-pointer relative z-10",
              activeTab === tab ? "text-charcoal font-medium" : "text-secondary hover:text-charcoal font-light"
            )}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-[1px] bg-charcoal" />
            )}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pt-2 scrollbar-hide flex flex-col gap-8 pb-12">
        {activeTab === 'Edge' && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-[11px] uppercase tracking-widest text-secondary font-medium">Model Picks</span>
              <div className="grid gap-3">
                {picks.map(({ title, pick }) => (
                  <MarketEdgeCard key={title} title={title} pick={pick} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'Players' && (
          <div className="flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* H2H Banner */}
            <div className="bg-black/[0.02] border border-black/5 p-6 md:p-8 rounded flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3 md:gap-4 text-2xl md:text-3xl">
                <span className="font-medium text-charcoal">{match.player1.name}</span>
                <span className="bg-white border border-black/10 px-3 py-1 rounded-md text-[13px] text-charcoal font-medium shadow-sm whitespace-nowrap tracking-widest">3 - 0</span>
                <span className="font-light text-secondary">{match.player2.name}</span>
              </div>
              <div className="text-sm text-secondary font-light leading-relaxed max-w-4xl border-t border-black/5 pt-5">
                {match.player1.name} holds a clear 3-0 head-to-head advantage over {match.player2.name} in their 3 meetings. In terms of sets won, {match.player1.name} leads 6-0. Overall, {match.player1.name} has won more games (38-24). On hard courts, {match.player1.name} leads 3-0. The last match was at the China Open - Beijing, with {match.player1.name} getting the victory 6-4 6-4.
              </div>
            </div>

            {/* Matchup Insights */}
            <div className="flex flex-col gap-4">
              <h3 className="text-[11px] uppercase tracking-widest text-secondary font-medium">Matchup Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { title: "Second Serve Efficiency", text: `Over the past six months, ${match.player2.name} has demonstrated stronger second serve performance compared to ${match.player1.name}, winning 45.43% of points versus 39.58%.` },
                  { title: "Return Game Proficiency", text: `Examining return games, ${match.player2.name} captures 47.52% of points on opponent's second serve. However, ${match.player1.name} has a slight edge in returning first serves, winning 32.70% compared to 28.85%.` },
                  { title: "Handling Pressure", text: `${match.player2.name} appears adept under pressure, saving 57.45% of breakpoints, which is notably higher than ${match.player1.name}'s 49.27%.` },
                  { title: "Overall Performance", text: `In terms of match wins over the last year, ${match.player2.name} has a superior record with a 65.79% win rate, while ${match.player1.name} holds a 55.56% win rate.` },
                  { title: "Surface Preferences", text: `${match.player2.name} thrives on clay courts with a 69% win rate but struggles on grass (38%). Alternatively, ${match.player1.name} excels on indoor hard courts, also with a 69% win rate.` },
                  { title: "Event Level Experience", text: `${match.player2.name} has mainly competed in Grand Slam events recently, winning 62.50% of matches, whereas ${match.player1.name} has been more present on the Main tour, winning 60.71%.` },
                  { title: "Head-to-Head Record", text: `${match.player1.name} has dominated direct encounters, winning all three past matches and all six sets played against ${match.player2.name}.` },
                  { title: "Quality of Opposition", text: `${match.player2.name} has faced opponents with an average rank of 131.61, while ${match.player1.name}'s adversaries had a stronger average rank of 92.19.` },
                  { title: "Decisive Set Performance", text: `In matches extending to a deciding set, ${match.player1.name} maintains a higher success rate at 64%, compared to ${match.player2.name}'s 55%.` },
                  { title: "Break Point Conversion", text: `${match.player1.name} exhibits superior breakpoint conversion, capitalizing on 42.64% of chances, clearly outperforming ${match.player2.name}'s 28.13%.` }
                ].map(insight => (
                  <div key={insight.title} className="flex flex-col gap-1.5 border-t border-black/5 pt-4">
                    <span className="text-sm font-medium text-charcoal">{insight.title}</span>
                    <p className="text-xs text-secondary leading-relaxed font-light">{insight.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <PlayerStatsSection match={match} />
          </div>
        )}

        {activeTab === 'Insights' && (
          <InsightsTab match={match} />
        )}
      </div>
    </>
  );
}

function ProfilePanel({ onClose }: { onClose: () => void }) {
  const [oddsFormat, setOddsFormat] = useState<'American' | 'Decimal' | 'Percentage'>('American');
  const [isBillingOpen, setIsBillingOpen] = useState(false);
  const [isEditingBilling, setIsEditingBilling] = useState(false);

  const [billingInfo, setBillingInfo] = useState({
    name: 'Jane Doe',
    address: '123 Tennis Court Ln',
    city: 'London',
    state: 'ENG',
    zip: 'SW19 5AE'
  });

  const toggleOddsFormat = () => {
    if (oddsFormat === 'American') setOddsFormat('Decimal');
    else if (oddsFormat === 'Decimal') setOddsFormat('Percentage');
    else setOddsFormat('American');
  };

  return (
    <>
      <div className="flex justify-end items-center shrink-0">
        <button onClick={onClose} className="text-secondary hover:text-charcoal text-lg font-light cursor-pointer transition-colors p-2 -mr-2">
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-1 shrink-0">
        <h2 className="text-2xl font-light">Account</h2>
        <p className="text-secondary text-sm">Manage your Vantage subscription.</p>
      </div>

      <div className="flex flex-col gap-2 mt-4 flex-1 pb-4">
         <button className="flex items-center justify-between p-4 bg-white border border-black/5 rounded-sm hover:-translate-y-[1px] hover:shadow-sm transition-all cursor-pointer group shrink-0">
            <div className="flex items-center gap-3 text-secondary group-hover:text-charcoal transition-colors">
              <Trophy className="w-4 h-4" />
              <span className="text-sm">Status</span>
            </div>
            <span className="text-xs text-charcoal font-medium bg-black/5 px-2 py-1 rounded text-center transition-colors hover:bg-black/10">
              Grand Slam
            </span>
         </button>

         <button 
           onClick={toggleOddsFormat}
           className="flex items-center justify-between p-4 bg-white border border-black/5 rounded-sm hover:-translate-y-[1px] hover:shadow-sm transition-all cursor-pointer group shrink-0"
         >
            <div className="flex items-center gap-3 text-secondary group-hover:text-charcoal transition-colors">
              <Calculator className="w-4 h-4" />
              <span className="text-sm">Odds Format</span>
            </div>
            <span className="text-xs text-charcoal font-medium bg-black/5 px-2 py-1 rounded w-20 text-center transition-colors hover:bg-black/10">
              {oddsFormat}
            </span>
         </button>

         <div className="flex flex-col bg-white border border-black/5 rounded-sm transition-all shrink-0">
           <button 
             onClick={() => setIsBillingOpen(!isBillingOpen)}
             className="flex items-center justify-between p-4 hover:-translate-y-[1px] hover:shadow-sm transition-all cursor-pointer group rounded-sm"
           >
              <div className="flex items-center gap-3 text-secondary group-hover:text-charcoal transition-colors">
                <CreditCard className="w-4 h-4" />
                <span className="text-sm">Payment</span>
              </div>
              <div className="flex items-center gap-3">
                 <span className="text-xs text-sage font-medium">Active</span>
                 <Settings className={cn("w-3 h-3 text-secondary transition-transform", isBillingOpen && "rotate-90")} />
              </div>
           </button>
           <AnimatePresence>
             {isBillingOpen && (
               <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: 'auto', opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden"
               >
                  <div className="p-4 pt-0 border-t border-black/5 mt-2 flex flex-col gap-4">
                    {isEditingBilling ? (
                        <div className="flex flex-col gap-3 text-xs w-full animate-in fade-in zoom-in-95">
                           <div className="flex flex-col gap-1.5">
                             <label className="text-[10px] text-secondary uppercase tracking-wider font-medium">Name</label>
                             <input type="text" value={billingInfo.name} onChange={(e) => setBillingInfo({...billingInfo, name: e.target.value})} className="border border-black/10 rounded-sm p-2 focus:outline-none focus:border-sage bg-ghost text-charcoal" />
                           </div>
                           <div className="flex flex-col gap-1.5">
                             <label className="text-[10px] text-secondary uppercase tracking-wider font-medium">Address</label>
                             <input type="text" value={billingInfo.address} onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})} className="border border-black/10 rounded-sm p-2 focus:outline-none focus:border-sage bg-ghost text-charcoal" />
                           </div>
                           <div className="grid grid-cols-3 gap-2">
                             <div className="flex flex-col gap-1.5 col-span-1">
                               <label className="text-[10px] text-secondary uppercase tracking-wider font-medium">City</label>
                               <input type="text" value={billingInfo.city} onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})} className="border border-black/10 rounded-sm p-2 focus:outline-none focus:border-sage bg-ghost text-charcoal" />
                             </div>
                             <div className="flex flex-col gap-1.5 col-span-1">
                               <label className="text-[10px] text-secondary uppercase tracking-wider font-medium">State</label>
                               <input type="text" value={billingInfo.state} onChange={(e) => setBillingInfo({...billingInfo, state: e.target.value})} className="border border-black/10 rounded-sm p-2 focus:outline-none focus:border-sage bg-ghost text-charcoal" />
                             </div>
                             <div className="flex flex-col gap-1.5 col-span-1">
                               <label className="text-[10px] text-secondary uppercase tracking-wider font-medium">Zip</label>
                               <input type="text" value={billingInfo.zip} onChange={(e) => setBillingInfo({...billingInfo, zip: e.target.value})} className="border border-black/10 rounded-sm p-2 focus:outline-none focus:border-sage bg-ghost text-charcoal" />
                             </div>
                           </div>
                           <div className="flex gap-2 mt-2">
                             <button onClick={() => setIsEditingBilling(false)} className="flex-1 bg-charcoal text-white rounded-sm py-2 font-medium hover:bg-black/90 transition-colors cursor-pointer">Save</button>
                             <button onClick={() => { setIsEditingBilling(false); }} className="flex-1 bg-black/5 text-charcoal rounded-sm py-2 font-medium hover:bg-black/10 transition-colors cursor-pointer">Cancel</button>
                           </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4 animate-in fade-in zoom-in-95">
                           <div className="flex justify-between items-center bg-ghost p-3 rounded-sm border border-black/5">
                             <div className="flex items-center gap-3">
                               <div className="w-8 h-5 bg-charcoal rounded-sm flex items-center justify-center">
                                 <span className="text-[8px] text-white font-bold italic tracking-wider">VISA</span>
                               </div>
                               <span className="text-xs font-mono text-charcoal">•••• 4242</span>
                             </div>
                             <span className="text-[10px] text-secondary">Exp 12/28</span>
                           </div>

                           <div className="flex flex-col gap-1">
                             <span className="text-[10px] uppercase tracking-widest text-secondary font-medium">Payment Details</span>
                             <div className="text-xs text-charcoal flex flex-col pt-1 leading-relaxed">
                               <span>{billingInfo.name}</span>
                               <span>{billingInfo.address}</span>
                               <span>{billingInfo.city}, {billingInfo.state} {billingInfo.zip}</span>
                             </div>
                           </div>

                           <button onClick={() => setIsEditingBilling(true)} className="text-[11px] text-charcoal font-medium underline underline-offset-2 hover:text-sage transition-colors w-fit mt-1 cursor-pointer">
                             Update Payment Information
                           </button>
                        </div>
                    )}
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
         </div>

         <button className="flex items-center justify-between p-4 bg-white border border-black/5 rounded-sm hover:-translate-y-[1px] hover:shadow-sm transition-all cursor-pointer group shrink-0 mt-auto">
            <div className="flex items-center gap-3 text-secondary group-hover:text-rose transition-colors">
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Log Out</span>
            </div>
            <span className="text-xs text-secondary/50 group-hover:text-rose/50 transition-colors">&rarr;</span>
         </button>
      </div>
    </>
  );
}

export default function App() {
  const [tourFilter, setTourFilter] = useState<TourFilter>('All');
  const [tournamentFilter, setTournamentFilter] = useState<string>('All');
  const [marketFilter, setMarketFilter] = useState<MarketFilter>('All Markets');
  const [minEvFilter, setMinEvFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMatch, setSelectedMatch] = useState<Matchup | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Reset tournament filter when tour filter changes
  useEffect(() => {
    setTournamentFilter('All');
  }, [tourFilter]);

  const activeTournaments = Array.from(new Set(
    MOCK_MATCHES
      .filter(m => tourFilter === 'All' || m.tour === tourFilter)
      .map(m => m.tournament)
  )).sort();

  const filteredMatches = MOCK_MATCHES.filter(m => {
    if (tourFilter !== 'All' && m.tour !== tourFilter) return false;
    if (tournamentFilter !== 'All' && m.tournament !== tournamentFilter) return false;
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        m.player1.name.toLowerCase().includes(query) ||
        m.player2.name.toLowerCase().includes(query) ||
        m.tournament.toLowerCase().includes(query);
      if (!matchesSearch) return false;
    }
    
    // Evaluate EV filter based on the actively selected market, or best pick if 'All'
    let relevantPick = m.modelPicks[m.bestPick]; // default to best
    if (marketFilter === 'Moneyline') relevantPick = m.modelPicks.moneyline;
    else if (marketFilter === 'Spread') relevantPick = m.modelPicks.spread;
    else if (marketFilter === 'Total') relevantPick = m.modelPicks.total;
    
    if (relevantPick.ev < minEvFilter) return false;

    return true;
  }).sort((a, b) => parseTimeMinutes(a.time) - parseTimeMinutes(b.time));

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-charcoal">
      
      {/* Header */}
      <header className="h-16 shrink-0 border-b border-black/5 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 z-30 relative w-full">
        <div className="flex items-center gap-8">
          <span 
            className="text-lg tracking-tight font-medium text-charcoal cursor-pointer"
            onClick={() => setSelectedMatch(null)}
          >
            VANTAGE
          </span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex bg-black/5 rounded-full p-1 border border-black/5">
            {(['All', 'ATP', 'WTA', 'Challenger'] as TourFilter[]).map(tour => (
              <button
                key={tour}
                onClick={() => setTourFilter(tour)}
                className={cn(
                  "pill !border-0 cursor-pointer transition-colors",
                  tourFilter === tour 
                    ? "bg-white text-charcoal shadow-sm" 
                    : "bg-transparent text-secondary hover:text-charcoal"
                )}
              >
                {tour}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsProfileOpen(true)}
            className="w-8 h-8 rounded-full bg-black/5 border border-black/10 flex items-center justify-center cursor-pointer hover:bg-black/10 transition-colors"
          >
            <div className="w-3 h-3 border border-black/40 rounded-full"></div>
          </button>
        </div>
      </header>

      {/* Main Area */}
      <div className="flex flex-1 overflow-hidden relative max-w-[1800px] w-full mx-auto">
        <main className="flex flex-col h-full overflow-y-auto transition-all duration-300 w-full lg:max-w-6xl lg:mx-auto relative">
          <div className="p-4 sm:p-6 flex flex-col gap-4 border-b border-black/[0.03] shrink-0 sticky top-0 bg-white z-10 w-full">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium uppercase tracking-widest">Daily Slate</span>
                <span className="text-xs text-secondary font-light">April 21, 2026 • {filteredMatches.length} Matches</span>
              </div>
              <div className="flex flex-wrap gap-3 items-center w-full sm:w-auto mt-2 sm:mt-0">
                
                {/* Search Input */}
                <div className="relative w-full sm:w-56 lg:w-64">
                  <Search className="w-3.5 h-3.5 text-secondary absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search players or tournaments..." 
                    className="w-full pl-8 pr-3 py-1.5 text-xs bg-black/5 rounded-md border border-transparent focus:border-black/5 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all placeholder:text-secondary/60 text-charcoal shadow-inner" 
                  />
                </div>

                {/* Market Filter */}
                <div className="flex bg-black/5 rounded-md p-0.5 border border-black/5 sm:ml-2">
                  {(['All Markets', 'Moneyline', 'Spread', 'Total'] as MarketFilter[]).map(m => (
                    <button
                      key={m}
                      onClick={() => setMarketFilter(m)}
                      className={cn(
                        "px-3 py-1 rounded text-[10px] uppercase tracking-wider font-medium cursor-pointer transition-colors",
                        marketFilter === m ? "bg-white text-charcoal shadow-sm" : "bg-transparent text-secondary hover:text-charcoal"
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>

                {/* EV Filter */}
                {[0, 3, 5].map(val => (
                  <button
                    key={val}
                    onClick={() => setMinEvFilter(val)}
                    className={cn(
                      "pill cursor-pointer transition-colors",
                      minEvFilter === val ? "bg-white text-charcoal shadow-sm border-black/10" : "bg-transparent text-secondary border-transparent hover:border-black/5"
                    )}
                  >
                    &gt;{val}% EV
                  </button>
                ))}
              </div>
            </div>

            {/* Tournament Sub-filter */}
            {activeTournaments.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide w-full mask-edges border-t border-black/[0.02] pt-4 mt-2">
                <button
                  onClick={() => setTournamentFilter('All')}
                  className={cn(
                    "pill whitespace-nowrap text-[10px] uppercase tracking-wider cursor-pointer transition-colors",
                    tournamentFilter === 'All' ? "bg-white text-charcoal shadow-sm border-black/10" : "bg-transparent text-secondary border-transparent hover:border-black/5"
                  )}
                >
                  All Tournaments
                </button>
                {activeTournaments.map(t => (
                  <button
                    key={t}
                    onClick={() => setTournamentFilter(t)}
                    className={cn(
                      "pill whitespace-nowrap text-[10px] uppercase tracking-wider cursor-pointer transition-colors",
                      tournamentFilter === t ? "bg-white text-charcoal shadow-sm border-black/10" : "bg-transparent text-secondary border-transparent hover:border-black/5"
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="pb-24 flex flex-col">
            {/* Desktop Table Header */}
            <div className="hidden lg:grid grid-cols-12 gap-4 px-6 py-3 border-b border-black/5 text-[10px] uppercase tracking-widest text-secondary font-medium sticky top-[138px] bg-white z-10 w-full">
               <div className="col-span-1">Time</div>
               <div className="col-span-3">Matchup</div>
               <div className="col-span-2">Moneyline</div>
               <div className="col-span-2">Spread</div>
               <div className="col-span-2">Total</div>
               <div className="col-span-2 text-right">Target Edge</div>
            </div>

            {filteredMatches.map((match) => {
              const activePick = marketFilter === 'All Markets' ? match.modelPicks[match.bestPick] : match.modelPicks[marketFilter.toLowerCase() as keyof typeof match.modelPicks];
              const isSelected = (pick: ModelPick) => activePick.valueLabel === pick.valueLabel && pick.ev > 0;

              return (
                <div 
                  key={match.id}
                  onClick={() => setSelectedMatch(match)}
                  className="group flex flex-col sm:grid sm:grid-cols-12 gap-y-4 sm:gap-4 p-4 lg:px-6 cursor-pointer hover:bg-black/[0.02] border-b border-black/[0.03] transition-colors"
                >
                  <div className="sm:col-span-1 text-[11px] text-secondary tabular-nums flex items-center">{match.time.split(' ')[0]}</div>
                  
                  <div className="sm:col-span-3 flex flex-col gap-1.5 justify-center">
                    <div className="text-[13px] font-medium flex items-center">{match.player1.name}</div>
                    <div className="text-[13px] font-medium flex items-center">{match.player2.name}</div>
                  </div>

                  {/* Markets Array for Desktop */}
                  <div className="hidden sm:flex sm:col-span-2 flex-col gap-1.5 justify-center text-[12px] tabular-nums">
                    <div className={cn("flex items-center h-5 w-fit px-1.5 -mx-1.5 rounded transition-colors", isSelected(match.modelPicks.moneyline) && match.modelPicks.moneyline.selection === 'p1' ? "bg-sage/15 text-sage font-medium" : "text-charcoal")}>{formatOdds(match.odds.moneyline.p1)}</div>
                    <div className={cn("flex items-center h-5 w-fit px-1.5 -mx-1.5 rounded transition-colors", isSelected(match.modelPicks.moneyline) && match.modelPicks.moneyline.selection === 'p2' ? "bg-sage/15 text-sage font-medium" : "text-charcoal")}>{formatOdds(match.odds.moneyline.p2)}</div>
                  </div>

                  <div className="hidden sm:flex sm:col-span-2 flex-col gap-1.5 justify-center text-[12px] tabular-nums">
                    <div className={cn("flex items-center h-5 w-fit px-1.5 -mx-1.5 rounded transition-colors", isSelected(match.modelPicks.spread) && match.modelPicks.spread.selection === 'p1' ? "bg-sage/15 text-sage font-medium" : "text-charcoal")}>
                      <span className="w-12 text-secondary font-light inline-block">{match.odds.spread.p1Value > 0 ? '+'+match.odds.spread.p1Value : match.odds.spread.p1Value}</span> {formatOdds(match.odds.spread.p1Odds)}
                    </div>
                    <div className={cn("flex items-center h-5 w-fit px-1.5 -mx-1.5 rounded transition-colors", isSelected(match.modelPicks.spread) && match.modelPicks.spread.selection === 'p2' ? "bg-sage/15 text-sage font-medium" : "text-charcoal")}>
                       <span className="w-12 text-secondary font-light inline-block">{match.odds.spread.p2Value > 0 ? '+'+match.odds.spread.p2Value : match.odds.spread.p2Value}</span> {formatOdds(match.odds.spread.p2Odds)}
                    </div>
                  </div>

                  <div className="hidden sm:flex sm:col-span-2 flex-col gap-1.5 justify-center text-[12px] tabular-nums">
                    <div className={cn("flex items-center h-5 w-fit px-1.5 -mx-1.5 rounded transition-colors", isSelected(match.modelPicks.total) && match.modelPicks.total.selection === 'over' ? "bg-sage/15 text-sage font-medium" : "text-charcoal")}>
                       <span className="w-12 text-secondary font-light inline-block">O {match.odds.total.value}</span> {formatOdds(match.odds.total.overOdds)}
                    </div>
                    <div className={cn("flex items-center h-5 w-fit px-1.5 -mx-1.5 rounded transition-colors", isSelected(match.modelPicks.total) && match.modelPicks.total.selection === 'under' ? "bg-sage/15 text-sage font-medium" : "text-charcoal")}>
                       <span className="w-12 text-secondary font-light inline-block">U {match.odds.total.value}</span> {formatOdds(match.odds.total.underOdds)}
                    </div>
                  </div>

                  <div className="sm:col-span-2 flex flex-col justify-center items-end ml-auto gap-0.5">
                    <div className={cn("text-[13px] font-medium tabular-nums", activePick.ev > 0 ? "text-sage" : "text-rose")}>
                      {activePick.ev > 0 ? '+' : ''}{activePick.ev.toFixed(1)}% EV
                    </div>
                    <div className="text-[9px] uppercase tracking-wider text-secondary leading-tight truncate max-w-[120px] text-right">
                       {activePick.valueLabel}
                    </div>
                  </div>
                </div>
              );
            })}
            {filteredMatches.length === 0 && (
              <div className="py-12 flex flex-col items-center justify-center text-secondary">
                 <p className="text-sm font-light">No matches found for this filter.</p>
              </div>
            )}
          </div>
        </main>

        {/* Full Screen Match Detail Panel (Slide-Over) */}
        <AnimatePresence>
          {selectedMatch && (
            <motion.aside
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-0 w-full h-full z-50 overflow-y-auto bg-ghost/95 backdrop-blur-md"
            >
              <div className="max-w-4xl mx-auto bg-white min-h-screen shadow-2xl p-6 sm:p-10 flex flex-col gap-8 border-x border-black/5">
                <MatchDetailPanel match={selectedMatch} onClose={() => setSelectedMatch(null)} />
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Profile Panel */}
        <AnimatePresence>
          {isProfileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-white/20 backdrop-blur-sm z-40"
                onClick={() => setIsProfileOpen(false)}
              />
              <motion.aside
                initial={{ x: '100%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 right-0 w-full sm:w-[400px] glass h-full p-6 sm:p-8 flex flex-col gap-8 shadow-2xl z-50 overflow-y-auto"
              >
                <ProfilePanel onClose={() => setIsProfileOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
