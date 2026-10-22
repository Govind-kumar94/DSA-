import React from 'react';
import { ComplexityInfo } from '../../types';

const COMPLEXITY_DATA: ComplexityInfo[] = [
  {
    name: 'Doubly Linked List',
    structure: 'Linear Node Chain (prev/next)',
    purpose: 'Sequential playlist navigation & reordering',
    timeAccess: 'O(n)',
    timeSearch: 'O(n)',
    timeInsert: 'O(1) at ends, O(n) middle',
    timeDelete: 'O(1) with pointer, O(n) middle',
    spaceComplexity: 'O(n)',
    tuneFlowApplication: 'Powers Next Track and Previous Track buttons without array shifting overhead. Supports bidirectional traversal.',
  },
  {
    name: 'Song Hash Map',
    structure: 'Buckets with Chaining',
    purpose: 'Instant track lookup by unique ID',
    timeAccess: 'O(1) average',
    timeSearch: 'O(1) average (O(n) worst)',
    timeInsert: 'O(1) average',
    timeDelete: 'O(1) average',
    spaceComplexity: 'O(n)',
    tuneFlowApplication: 'Retrieves complete song metadata when only a song ID is stored inside playlist arrays or queued items.',
  },
  {
    name: 'Playback Queue',
    structure: 'FIFO (First-In, First-Out)',
    purpose: 'Upcoming scheduled playback buffer',
    timeAccess: 'O(n)',
    timeSearch: 'O(n)',
    timeInsert: 'O(1) Enqueue',
    timeDelete: 'O(1) Dequeue',
    spaceComplexity: 'O(n)',
    tuneFlowApplication: 'Guarantees songs explicitly added to queue are dequeued and played in exact user-requested sequence.',
  },
  {
    name: 'Playback History Stack',
    structure: 'LIFO (Last-In, First-Out)',
    purpose: 'Backtrack playback rewind history',
    timeAccess: 'O(n)',
    timeSearch: 'O(n)',
    timeInsert: 'O(1) Push',
    timeDelete: 'O(1) Pop',
    spaceComplexity: 'O(n)',
    tuneFlowApplication: 'Maintains chronological record of completed songs. Enables instant previous track playback jumping.',
  },
  {
    name: 'Merge Sort',
    structure: 'Divide & Conquer (Recursive)',
    purpose: 'Stable deterministic catalog sorting',
    timeAccess: 'N/A',
    timeSearch: 'N/A',
    timeInsert: 'O(n log n) Best/Avg/Worst',
    timeDelete: 'N/A',
    spaceComplexity: 'O(n)',
    tuneFlowApplication: 'Sorts thousands of songs by title or duration while preserving existing relative order of equal keys.',
  },
  {
    name: 'Quick Sort',
    structure: 'Partitioning (Lomuto)',
    purpose: 'High-speed cache-friendly sorting',
    timeAccess: 'N/A',
    timeSearch: 'N/A',
    timeInsert: 'O(n log n) Avg (O(n²) Worst)',
    timeDelete: 'N/A',
    spaceComplexity: 'O(log n)',
    tuneFlowApplication: 'In-place sorting for large catalogs with minimal memory allocation overhead.',
  },
  {
    name: 'Binary Search',
    structure: 'Logarithmic Halving Probe',
    purpose: 'Instant search on sorted catalogs',
    timeAccess: 'N/A',
    timeSearch: 'O(log n)',
    timeInsert: 'N/A',
    timeDelete: 'N/A',
    spaceComplexity: 'O(1)',
    tuneFlowApplication: 'Locates songs in sorted libraries in ~4 comparisons for 20 items (or ~16 comparisons for 100,000 items).',
  },
  {
    name: 'Song Graph (BFS/DFS)',
    structure: 'Adjacency List with Edge Weights',
    purpose: 'Musical similarity recommendation',
    timeAccess: 'N/A',
    timeSearch: 'O(V + E)',
    timeInsert: 'O(1) Add Edge/Node',
    timeDelete: 'O(V) Remove Node',
    spaceComplexity: 'O(V + E)',
    tuneFlowApplication: 'Connects songs sharing genres, artist affinity, or BPM ranges. BFS discovers closest acoustic neighbors.',
  },
];

export const ComplexityTable: React.FC = () => {
  return (
    <div className="rounded-lg bg-[#0e131b] border border-slate-800 overflow-hidden text-xs">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-slate-100 text-sm font-sans">
            TuneFlow Big-O Complexity Reference & System Rationale
          </h4>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">
            Formal computational benchmarks for all Data Structures & Algorithms implemented in the project.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-[#0a0d14] text-[11px] font-mono text-slate-400 uppercase">
              <th className="py-2.5 px-4 font-semibold">Algorithm / Structure</th>
              <th className="py-2.5 px-4 font-semibold">Access / Search</th>
              <th className="py-2.5 px-4 font-semibold">Insertion / Deletion</th>
              <th className="py-2.5 px-4 font-semibold">Space Complexity</th>
              <th className="py-2.5 px-4 font-semibold min-w-[260px]">Application in TuneFlow</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
            {COMPLEXITY_DATA.map((row) => (
              <tr key={row.name} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-4">
                  <p className="font-sans font-semibold text-slate-200 text-xs">{row.name}</p>
                  <p className="text-slate-500 text-[10px]">{row.structure}</p>
                </td>
                <td className="py-3 px-4 text-emerald-400">
                  {row.timeSearch}
                </td>
                <td className="py-3 px-4 text-amber-400">
                  {row.timeInsert}
                </td>
                <td className="py-3 px-4 text-sky-400">
                  {row.spaceComplexity}
                </td>
                <td className="py-3 px-4 font-sans text-slate-300 text-xs">
                  {row.tuneFlowApplication}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
