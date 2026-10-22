/**
 * TuneFlow Music Relationship Graph
 * 
 * Purpose in TuneFlow:
 * Models musical similarity networks. Nodes represent individual tracks.
 * Edges represent shared artistic attributes (matching genre, artist affinity,
 * similar tempo BPM). Powers the smart recommendation engine using BFS & DFS.
 */

import { Song } from '../types';

export interface GraphEdge {
  targetId: string;
  weight: number; // 1 to 5 strength of connection
  reason: string; // e.g., 'Same Genre: Electronic', 'Artist Match'
}

export interface GraphTraversalStep {
  step: number;
  currentNodeId: string;
  frontier: string[]; // queue or stack state
  visited: string[];
  action: string;
}

export class SongGraph {
  private adjacencyList: Map<string, GraphEdge[]> = new Map();
  private songMap: Map<string, Song> = new Map();

  /**
   * Add song vertex
   */
  public addSong(song: Song): void {
    this.songMap.set(song.id, song);
    if (!this.adjacencyList.has(song.id)) {
      this.adjacencyList.set(song.id, []);
    }
  }

  /**
   * Add bidirectional weighted edge
   */
  public addEdge(id1: string, id2: string, weight: number, reason: string): void {
    if (!this.adjacencyList.has(id1) || !this.adjacencyList.has(id2)) return;

    const list1 = this.adjacencyList.get(id1)!;
    if (!list1.some(e => e.targetId === id2)) {
      list1.push({ targetId: id2, weight, reason });
    }

    const list2 = this.adjacencyList.get(id2)!;
    if (!list2.some(e => e.targetId === id1)) {
      list2.push({ targetId: id1, weight, reason });
    }
  }

  public getSong(id: string): Song | undefined {
    return this.songMap.get(id);
  }

  public getNeighbors(id: string): GraphEdge[] {
    return this.adjacencyList.get(id) || [];
  }

  public getAllNodes(): Song[] {
    return Array.from(this.songMap.values());
  }

  public getAllEdges(): { source: string; target: string; weight: number; reason: string }[] {
    const edges: { source: string; target: string; weight: number; reason: string }[] = [];
    const seen = new Set<string>();

    this.adjacencyList.forEach((adj, source) => {
      adj.forEach(edge => {
        const key = [source, edge.targetId].sort().join('--');
        if (!seen.has(key)) {
          seen.add(key);
          edges.push({
            source,
            target: edge.targetId,
            weight: edge.weight,
            reason: edge.reason,
          });
        }
      });
    });
    return edges;
  }

  /**
   * Breadth-First Search (BFS) - Level-by-level exploration (Queue)
   * Discovers nearest musical neighbors first.
   */
  public bfs(startId: string): { order: Song[]; steps: GraphTraversalStep[] } {
    if (!this.songMap.has(startId)) return { order: [], steps: [] };

    const visited = new Set<string>();
    const queue: string[] = [startId];
    visited.add(startId);

    const order: Song[] = [];
    const steps: GraphTraversalStep[] = [];
    let stepCount = 1;

    steps.push({
      step: stepCount++,
      currentNodeId: startId,
      frontier: [...queue],
      visited: Array.from(visited),
      action: `Initialized BFS queue with starting track: "${this.songMap.get(startId)?.title}"`,
    });

    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const song = this.songMap.get(currentId)!;
      order.push(song);

      const neighbors = this.adjacencyList.get(currentId) || [];
      const newlyQueued: string[] = [];

      for (const edge of neighbors) {
        if (!visited.has(edge.targetId)) {
          visited.add(edge.targetId);
          queue.push(edge.targetId);
          newlyQueued.push(this.songMap.get(edge.targetId)?.title || edge.targetId);
        }
      }

      steps.push({
        step: stepCount++,
        currentNodeId: currentId,
        frontier: [...queue],
        visited: Array.from(visited),
        action: newlyQueued.length > 0
          ? `Visited "${song.title}". Enqueued ${newlyQueued.length} musical neighbor(s): ${newlyQueued.join(', ')}.`
          : `Visited "${song.title}". All neighbors already explored.`,
      });
    }

    return { order, steps };
  }

  /**
   * Depth-First Search (DFS) - Deep recursive branch exploration (Stack)
   * Discovers long exploratory listening journeys.
   */
  public dfs(startId: string): { order: Song[]; steps: GraphTraversalStep[] } {
    if (!this.songMap.has(startId)) return { order: [], steps: [] };

    const visited = new Set<string>();
    const stack: string[] = [startId];
    const order: Song[] = [];
    const steps: GraphTraversalStep[] = [];
    let stepCount = 1;

    steps.push({
      step: stepCount++,
      currentNodeId: startId,
      frontier: [...stack],
      visited: [],
      action: `Initialized DFS stack with start track: "${this.songMap.get(startId)?.title}"`,
    });

    while (stack.length > 0) {
      const currentId = stack.pop()!;
      if (!visited.has(currentId)) {
        visited.add(currentId);
        const song = this.songMap.get(currentId)!;
        order.push(song);

        const neighbors = this.adjacencyList.get(currentId) || [];
        const pushed: string[] = [];

        // Push neighbors to stack
        for (const edge of neighbors) {
          if (!visited.has(edge.targetId)) {
            stack.push(edge.targetId);
            pushed.push(this.songMap.get(edge.targetId)?.title || edge.targetId);
          }
        }

        steps.push({
          step: stepCount++,
          currentNodeId: currentId,
          frontier: [...stack],
          visited: Array.from(visited),
          action: pushed.length > 0
            ? `Popped & visited "${song.title}". Pushed ${pushed.length} branch(es) to stack.`
            : `Popped & visited "${song.title}". Dead end reached, backtracking.`,
        });
      }
    }

    return { order, steps };
  }

  /**
   * Build automatic similarity graph from catalog
   */
  public static buildFromCatalog(songs: Song[]): SongGraph {
    const graph = new SongGraph();
    songs.forEach(s => graph.addSong(s));

    // Create edges based on genre, artist affinity, or tempo
    for (let i = 0; i < songs.length; i++) {
      for (let j = i + 1; j < songs.length; j++) {
        const s1 = songs[i];
        const s2 = songs[j];

        if (s1.artist === s2.artist) {
          graph.addEdge(s1.id, s2.id, 5, `Same Artist: ${s1.artist}`);
        } else if (s1.genre === s2.genre) {
          graph.addEdge(s1.id, s2.id, 3, `Shared Genre: ${s1.genre}`);
        } else if (s1.bpm && s2.bpm && Math.abs(s1.bpm - s2.bpm) <= 6) {
          graph.addEdge(s1.id, s2.id, 2, `Harmonic Tempo (${s1.bpm} vs ${s2.bpm} BPM)`);
        }
      }
    }

    return graph;
  }
}
