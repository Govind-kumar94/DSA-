# TuneFlow – Music Playlist Management System & DSA Laboratory

TuneFlow is a full-stack, client-first music playlist web application and interactive **Data Structures and Algorithms (DSA)** laboratory. Designed with the quiet, disciplined aesthetic of European and Swiss railway systems (SBB / JR transit authority styling: high-contrast dark charcoal canvas, hairline borders, tabular departure-board typography, and signal amber accents), TuneFlow combines actual playable audio streaming with real, working data structures powering playback operations.

---

## 1. Project Overview & Objectives

In modern web development, music streaming applications (like Spotify and Apple Music) rely fundamentally on classic computer science algorithms to guarantee low-latency search, efficient queue scheduling, fast bidirectional playlist traversal, and content recommendations. 

TuneFlow bridges theoretical computer science with real-world product engineering by implementing 7 core data structures and algorithms in TypeScript, embedding them directly into the runtime music player engine, and providing an interactive visual laboratory for college project demonstrations and viva defense.

---

## 2. System Architecture & Tech Stack

```
                        ┌──────────────────────────────────────────────┐
                        │              TuneFlow Application            │
                        └──────────────────────┬───────────────────────┘
                                               │
               ┌───────────────────────────────┼───────────────────────────────┐
               ▼                               ▼                               ▼
       [ Presentation ]                 [ Data Structures ]            [ Audio Engine ]
   • React 19 + TypeScript          • Doubly Linked List (DLL)     • HTML5 Audio API
   • Tailwind CSS (Restrained)      • Song Hash Map (Chaining)     • Harmonic Web Audio Synth
   • Lucide React Icons             • Playback Queue (FIFO)        • Local Audio File Reader
   • Responsive Desktop/Mobile      • Playback History (LIFO)      • Zero-broken-audio guarantee
   • 1440px baseline layouts        • Music Graph (BFS/DFS)
```

### Technology Stack:
- **Framework**: React 19 (SPA on Vite 8)
- **Language**: TypeScript (strict types, comprehensive interfaces)
- **Styling**: Tailwind CSS with custom Swiss-style typography (`Plus Jakarta Sans` & `JetBrains Mono` tabular numerals)
- **Icons**: Lucide React
- **Audio Subsystem**: Hybrid HTML5 Audio + Procedural Web Audio API Harmonic Synthesizer fallback
- **Persistence**: Browser `localStorage` for playlists, custom uploaded audio metadata, and playback settings

---

## 3. Data Structures & Algorithm Complexities

| Data Structure / Algorithm | File Location | Purpose in TuneFlow | Time Complexity (Avg) | Time Complexity (Worst) | Space Complexity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Doubly Linked List** | `src/structures/DoublyLinkedList.ts` | Bidirectional playlist playback & sequence traversal | $O(1)$ next/prev, $O(1)$ ends | $O(n)$ index search | $O(n)$ |
| **Song Hash Map** | `src/structures/SongHashMap.ts` | Instant song metadata retrieval by unique ID | $O(1)$ lookup, insert, delete | $O(n)$ hash collision | $O(n)$ with rehashing |
| **Playback Queue** | `src/structures/PlaybackQueue.ts` | Scheduled upcoming tracks buffer (FIFO) | $O(1)$ enqueue, $O(1)$ dequeue | $O(n)$ mid-queue remove | $O(n)$ |
| **Playback History Stack** | `src/structures/PlaybackHistoryStack.ts` | Chronological rewind & backtrack history (LIFO) | $O(1)$ push, $O(1)$ pop, peek | $O(1)$ | $O(n)$ (bounded max 50) |
| **Merge Sort** | `src/algorithms/sorting.ts` | Stable catalog sorting by title/duration | $O(n \log n)$ | $O(n \log n)$ | $O(n)$ |
| **Quick Sort** | `src/algorithms/sorting.ts` | In-place partition sorting | $O(n \log n)$ | $O(n^2)$ | $O(\log n)$ |
| **Binary Search** | `src/algorithms/searching.ts` | Logarithmic search probe on sorted catalogs | $O(\log n)$ | $O(\log n)$ | $O(1)$ |
| **Linear Search** | `src/algorithms/searching.ts` | Sequential baseline search | $O(n)$ | $O(n)$ | $O(1)$ |
| **Similarity Graph (BFS)** | `src/structures/songGraph.ts` | Nearest acoustic neighbor song recommendations | $O(V + E)$ | $O(V + E)$ | $O(V + E)$ |
| **Similarity Graph (DFS)** | `src/structures/songGraph.ts` | Deep thematic acoustic exploration journeys | $O(V + E)$ | $O(V + E)$ | $O(V + E)$ |

---

## 4. How TuneFlow Integrates DSA with Audio Playback

Unlike static prototypes that illustrate algorithms with disconnected animations, TuneFlow's core music player actively runs on these structures:

1. **Doubly Linked List (`currentPlaylistDLL`)**: When a user selects a playlist, its songs are appended to a `DoublyLinkedList<Song>`. Clicking **Next Track** executes `currentPlaylistDLL.next()`, while **Previous Track** executes `currentPlaylistDLL.prev()`. Both operations run in $O(1)$ time without array re-indexing.
2. **Song Hash Map (`songHashMap`)**: Playlists and Queue items store only song IDs (`track-01`, `track-06`). The player and table rows retrieve full song objects via `songHashMap.get(id)`, executing in $O(1)$ average time through a polynomial rolling hash function with separate chaining.
3. **Playback Queue (`playbackQueue`)**: When songs are queued via "+ Enqueue", they are added to a FIFO Queue. When the active track ends, `handleTrackEnd()` dequeues the head item and plays it before continuing the default playlist sequence.
4. **Playback History Stack (`playbackHistory`)**: Every song that plays to completion or transitions is pushed to a LIFO Stack. Clicking "Previous" pops the most recent track, allowing multi-step backtracks.
5. **Similarity Graph (`songGraph`)**: Nodes are song tracks; edges represent shared genres, artist affinity, and tempo BPM matches. The **Now Playing** panel uses the graph adjacency list to suggest musically related songs.

---

## 5. Sample Test Cases & Expected Outputs

The following test suites verify the correctness of the data structures and algorithms:

### Test Case 1: Doubly Linked List Bidirectional Navigation
- **Input Action**: 
  1. Initialize list: Append "Track A", "Track B", "Track C".
  2. Set current to "Track A".
  3. Call `next()`.
  4. Call `next()`.
  5. Call `prev()`.
- **Expected Output**:
  - Step 3 returns: "Track B" (O(1))
  - Step 4 returns: "Track C" (O(1))
  - Step 5 returns: "Track B" (O(1))
  - `list.size` equals `3`.

### Test Case 2: Song Hash Map Chaining & Retrieval
- **Input Action**:
  1. Insert key `track-01` with value "Gymnopédie No. 1".
  2. Insert key `track-09` with value "Subway Phosphor".
  3. Call `get('track-01')`.
  4. Call `get('invalid-id')`.
- **Expected Output**:
  - `get('track-01')` returns `value: Song, steps: 1, bucketIndex: validIndex`.
  - `get('invalid-id')` returns `value: null`.

### Test Case 3: Merge Sort Stability & Comparison Count
- **Input Action**: Run `runMergeSort()` on 8 catalog songs sorted by `duration`.
- **Expected Output**:
  - Songs are ordered strictly in ascending duration: e.g., 154s ("Cello Suite") < 165s < 176s < ... < 320s.
  - Number of comparisons is bounded by $\le n \lceil \log_2 n \rceil = 8 \times 3 = 24$.
  - Original relative order of songs with identical duration is preserved (stable sort).

### Test Case 4: Binary Search vs Linear Search Comparisons
- **Input Action**: Search for "Nocturne in E-flat major" in a catalog of 22 sorted tracks.
- **Expected Output**:
  - **Binary Search**: Locates track in $\le \lceil \log_2(22) \rceil + 1 = 5$ comparisons.
  - **Linear Search**: Locates track in sequential index probe (e.g., 14 comparisons).
  - Both return identical song object.

### Test Case 5: Graph BFS Nearest Neighbor Exploration
- **Input Action**: Run `songGraph.bfs('track-01')` where Track 01 is Classical.
- **Expected Output**:
  - Level 1 frontier explores other Classical tracks (Debussy, Bach, Vivaldi, Chopin) before branching out.
  - All visited vertices are added to `visited` Set with zero duplicate revisits.

---

## 6. Local Setup & Build Instructions

### Prerequisites:
- Node.js (version 18 or higher)
- npm (version 9 or higher)

### Installation:
```bash
# 1. Install dependencies
npm install

# 2. Run TypeScript type checks
npm run lint

# 3. Build for production
npm run build

# 4. Start local development server
npm run dev
```

---

## 7. College Project Viva Q&A Guide

1. **Q: Why use a Doubly Linked List over an Array for playlist playback?**
   - *A*: An array requires $O(n)$ time to shift subsequent elements when a user deletes or moves a track in a playlist. A Doubly Linked List updates adjacent `node.prev` and `node.next` references in $O(1)$ time. Moving between adjacent tracks is an immediate pointer dereference ($O(1)$) rather than an array lookup with boundary calculation.
2. **Q: How are hash collisions resolved in the Song Hash Map?**
   - *A*: Separate chaining is implemented. Each hash bucket holds an array (or linked list) of key-value pairs. When multiple IDs hash to the same bucket index, the entry is chained. Dynamic rehashing doubles capacity when load factor exceeds 75%.
3. **Q: How does the app guarantee music playback without broken audio?**
   - *A*: TuneFlow employs a dual-engine architecture. It streams verified public-domain classical audio files via HTML5 Audio, and features an integrated Web Audio API harmonic synthesizer that automatically generates polyphonic musical pads and rhythms if offline or restricted by browser policies.
