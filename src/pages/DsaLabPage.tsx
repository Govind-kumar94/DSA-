import React, { useState } from 'react';
import { 
  Cpu, 
  ArrowLeftRight, 
  Database, 
  ListMusic, 
  Layers, 
  ArrowUpDown, 
  Search, 
  Network, 
  Table 
} from 'lucide-react';
import { DoublyLinkedListVisualizer } from '../components/dsa/DoublyLinkedListVisualizer';
import { HashMapVisualizer } from '../components/dsa/HashMapVisualizer';
import { QueueVisualizer } from '../components/dsa/QueueVisualizer';
import { StackVisualizer } from '../components/dsa/StackVisualizer';
import { SortingVisualizer } from '../components/dsa/SortingVisualizer';
import { SearchingVisualizer } from '../components/dsa/SearchingVisualizer';
import { GraphVisualizer } from '../components/dsa/GraphVisualizer';
import { ComplexityTable } from '../components/dsa/ComplexityTable';
import { LiveSystemInspector } from '../components/dsa/LiveSystemInspector';

type DsaTab = 
  | 'live'
  | 'dll' 
  | 'hash' 
  | 'queue' 
  | 'stack' 
  | 'sort' 
  | 'search' 
  | 'graph' 
  | 'matrix';

interface TabItem {
  id: DsaTab;
  label: string;
  icon: React.ElementType;
  badge: string;
}

export const DsaLabPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DsaTab>('live');

  const tabs: TabItem[] = [
    { id: 'live', label: '🔴 Live Runtime Inspector', icon: Cpu, badge: 'Live Engine' },
    { id: 'dll', label: '1. Doubly Linked List', icon: ArrowLeftRight, badge: 'O(1) Nav' },
    { id: 'hash', label: '2. Song Hash Map', icon: Database, badge: 'O(1) Lookup' },
    { id: 'queue', label: '3. Playback Queue', icon: ListMusic, badge: 'FIFO' },
    { id: 'stack', label: '4. History Stack', icon: Layers, badge: 'LIFO' },
    { id: 'sort', label: '5. Merge vs Quick Sort', icon: ArrowUpDown, badge: 'O(n log n)' },
    { id: 'search', label: '6. Binary vs Linear', icon: Search, badge: 'O(log n)' },
    { id: 'graph', label: '7. Similarity Graph', icon: Network, badge: 'BFS / DFS' },
    { id: 'matrix', label: '8. Complexity Matrix & Viva', icon: Table, badge: 'Reference' },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="p-6 rounded-xl bg-[#0e131b] border border-slate-800 shadow-xl space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
            Educational Laboratory
          </span>
          <span className="text-slate-600">·</span>
          <span className="text-xs font-mono text-slate-400">College DSA Project Demonstration</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-slate-100 font-sans tracking-tight">
          TuneFlow Algorithm Explorer
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-3xl">
          An interactive laboratory demonstrating how core Data Structures and Algorithms power high-performance music playlist management. Every visualizer below executes actual TypeScript data structure operations with live state and execution logs.
        </p>
      </div>

      {/* Segmented Tab Navigation - Railway System Styling */}
      <div className="flex items-center gap-1.5 p-1.5 bg-[#0e131b] border border-slate-800 rounded-lg overflow-x-auto text-xs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium whitespace-nowrap shrink-0 transition-colors ${
                isActive
                  ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                isActive ? 'bg-black/20 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
              }`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Component */}
      <div className="pt-2">
        {activeTab === 'live' && <LiveSystemInspector />}
        {activeTab === 'dll' && <DoublyLinkedListVisualizer />}
        {activeTab === 'hash' && <HashMapVisualizer />}
        {activeTab === 'queue' && <QueueVisualizer />}
        {activeTab === 'stack' && <StackVisualizer />}
        {activeTab === 'sort' && <SortingVisualizer />}
        {activeTab === 'search' && <SearchingVisualizer />}
        {activeTab === 'graph' && <GraphVisualizer />}
        {activeTab === 'matrix' && <ComplexityTable />}
      </div>
    </div>
  );
};
