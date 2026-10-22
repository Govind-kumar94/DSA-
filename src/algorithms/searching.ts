/**
 * TuneFlow Searching Algorithms: Linear Search vs Binary Search
 * 
 * Purpose in TuneFlow:
 * Evaluates performance difference between scanning an unsorted catalog vs
 * doing logarithmic binary probe on an indexed/sorted library.
 */

import { Song } from '../types';

export interface SearchStep {
  stepIndex: number;
  currentIndex: number;
  lowIndex?: number;
  highIndex?: number;
  midIndex?: number;
  comparedItemTitle: string;
  isMatch: boolean;
  explanation: string;
  totalComparisons: number;
}

export interface SearchResult {
  foundIndex: number;
  foundSong: Song | null;
  comparisons: number;
  timeMs: number;
  steps: SearchStep[];
  algorithm: 'Linear Search' | 'Binary Search';
  collectionSorted: boolean;
}

/**
 * Linear Search - O(n)
 * Checks each item sequentially from index 0 until match or end.
 */
export function runLinearSearch(songs: Song[], targetQuery: string): SearchResult {
  const startTime = performance.now();
  let comparisons = 0;
  const steps: SearchStep[] = [];
  const normalized = targetQuery.trim().toLowerCase();

  let foundIndex = -1;
  let foundSong: Song | null = null;

  for (let i = 0; i < songs.length; i++) {
    comparisons++;
    const current = songs[i];
    const isMatch = current.title.toLowerCase().includes(normalized) || 
                    current.artist.toLowerCase().includes(normalized);

    steps.push({
      stepIndex: i + 1,
      currentIndex: i,
      comparedItemTitle: current.title,
      isMatch,
      explanation: isMatch
        ? `Match found at index [${i}]: "${current.title}" by ${current.artist}`
        : `Index [${i}]: "${current.title}" does not match "${targetQuery}"`,
      totalComparisons: comparisons,
    });

    if (isMatch) {
      foundIndex = i;
      foundSong = current;
      break;
    }
  }

  const timeMs = Number((performance.now() - startTime).toFixed(3));

  return {
    foundIndex,
    foundSong,
    comparisons,
    timeMs,
    steps,
    algorithm: 'Linear Search',
    collectionSorted: false,
  };
}

/**
 * Binary Search - O(log n)
 * Requires sorted array by title. Halves search interval on each step.
 */
export function runBinarySearch(songs: Song[], targetTitle: string): SearchResult {
  const startTime = performance.now();
  let comparisons = 0;
  const steps: SearchStep[] = [];
  const normalizedTarget = targetTitle.trim().toLowerCase();

  // Verify sorted status
  let isSorted = true;
  for (let i = 1; i < songs.length; i++) {
    if (songs[i - 1].title.toLowerCase().localeCompare(songs[i].title.toLowerCase()) > 0) {
      isSorted = false;
      break;
    }
  }

  // Work on sorted clone if not sorted, but note it
  const workingArray = isSorted
    ? songs
    : [...songs].sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));

  let low = 0;
  let high = workingArray.length - 1;
  let foundIndex = -1;
  let foundSong: Song | null = null;
  let stepCount = 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const midSong = workingArray[mid];
    const midVal = midSong.title.toLowerCase();
    comparisons++;

    if (midVal === normalizedTarget || midVal.includes(normalizedTarget)) {
      steps.push({
        stepIndex: stepCount++,
        currentIndex: mid,
        lowIndex: low,
        highIndex: high,
        midIndex: mid,
        comparedItemTitle: midSong.title,
        isMatch: true,
        explanation: `Target located at mid index [${mid}]: "${midSong.title}"`,
        totalComparisons: comparisons,
      });
      foundIndex = mid;
      foundSong = midSong;
      break;
    }

    const cmp = midVal.localeCompare(normalizedTarget);

    if (cmp < 0) {
      // midVal is alphabetically smaller -> target is in upper half
      steps.push({
        stepIndex: stepCount++,
        currentIndex: mid,
        lowIndex: low,
        highIndex: high,
        midIndex: mid,
        comparedItemTitle: midSong.title,
        isMatch: false,
        explanation: `"${midSong.title}" < "${targetTitle}". Discarding left half [${low}..${mid}]. Shifting low to ${mid + 1}.`,
        totalComparisons: comparisons,
      });
      low = mid + 1;
    } else {
      // midVal is alphabetically larger -> target is in lower half
      steps.push({
        stepIndex: stepCount++,
        currentIndex: mid,
        lowIndex: low,
        highIndex: high,
        midIndex: mid,
        comparedItemTitle: midSong.title,
        isMatch: false,
        explanation: `"${midSong.title}" > "${targetTitle}". Discarding right half [${mid}..${high}]. Shifting high to ${mid - 1}.`,
        totalComparisons: comparisons,
      });
      high = mid - 1;
    }
  }

  const timeMs = Number((performance.now() - startTime).toFixed(3));

  return {
    foundIndex,
    foundSong,
    comparisons,
    timeMs,
    steps,
    algorithm: 'Binary Search',
    collectionSorted: isSorted,
  };
}
