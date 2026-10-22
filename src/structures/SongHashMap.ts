/**
 * TuneFlow Hash Map Implementation with Separate Chaining
 * 
 * Purpose in TuneFlow:
 * Instant O(1) average-time lookup of song metadata by unique song ID.
 * Avoids linear scan across hundreds of library tracks.
 */

export interface HashEntry<K, V> {
  key: K;
  value: V;
}

export class SongHashMap<V> {
  private buckets: HashEntry<string, V>[][];
  private capacity: number;
  private count: number = 0;
  private readonly loadFactorThreshold = 0.75;

  constructor(initialCapacity: number = 8) {
    this.capacity = initialCapacity;
    this.buckets = Array.from({ length: this.capacity }, () => []);
  }

  /**
   * Polynomial rolling hash function for strings
   */
  private hash(key: string): number {
    let hashVal = 0;
    const prime = 31;
    for (let i = 0; i < key.length; i++) {
      hashVal = (hashVal * prime + key.charCodeAt(i)) >>> 0;
    }
    return hashVal % this.capacity;
  }

  public getHashIndex(key: string): number {
    return this.hash(key);
  }

  public getCapacity(): number {
    return this.capacity;
  }

  public size(): number {
    return this.count;
  }

  public getLoadFactor(): number {
    return this.count / this.capacity;
  }

  /**
   * Put key-value pair - O(1) average
   */
  public put(key: string, value: V): { bucketIndex: number; collided: boolean; rehashed: boolean } {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    let collided = bucket.length > 0;
    let existingIndex = bucket.findIndex(entry => entry.key === key);

    if (existingIndex !== -1) {
      bucket[existingIndex].value = value;
      return { bucketIndex: index, collided: bucket.length > 1, rehashed: false };
    }

    bucket.push({ key, value });
    this.count++;

    let rehashed = false;
    if (this.getLoadFactor() > this.loadFactorThreshold) {
      this.rehash(this.capacity * 2);
      rehashed = true;
    }

    return { bucketIndex: index, collided, rehashed };
  }

  /**
   * Get value by key - O(1) average
   */
  public get(key: string): { value: V | null; bucketIndex: number; steps: number } {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    let steps = 0;

    for (const entry of bucket) {
      steps++;
      if (entry.key === key) {
        return { value: entry.value, bucketIndex: index, steps };
      }
    }

    return { value: null, bucketIndex: index, steps };
  }

  /**
   * Check if key exists - O(1) average
   */
  public has(key: string): boolean {
    return this.get(key).value !== null;
  }

  /**
   * Delete entry - O(1) average
   */
  public remove(key: string): { success: boolean; bucketIndex: number } {
    const index = this.hash(key);
    const bucket = this.buckets[index];
    const initialLen = bucket.length;

    this.buckets[index] = bucket.filter(entry => entry.key !== key);

    if (this.buckets[index].length < initialLen) {
      this.count--;
      return { success: true, bucketIndex: index };
    }
    return { success: false, bucketIndex: index };
  }

  /**
   * Dynamic Rehashing
   */
  private rehash(newCapacity: number): void {
    const oldBuckets = this.buckets;
    this.capacity = newCapacity;
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this.count = 0;

    for (const bucket of oldBuckets) {
      for (const entry of bucket) {
        this.put(entry.key, entry.value);
      }
    }
  }

  public clear(): void {
    this.capacity = 8;
    this.buckets = Array.from({ length: this.capacity }, () => []);
    this.count = 0;
  }

  /**
   * Returns snapshot for visualization in DSA Lab
   */
  public getVisualizationSnapshot(): { index: number; entries: HashEntry<string, V>[] }[] {
    return this.buckets.map((entries, index) => ({
      index,
      entries: [...entries],
    }));
  }
}
