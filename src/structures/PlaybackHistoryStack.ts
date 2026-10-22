/**
 * TuneFlow Playback History Stack (LIFO - Last In, First Out)
 * 
 * Purpose in TuneFlow:
 * Maintains a chronological stack of previously played tracks.
 * When the user hits "Previous Track" or inspects recent history,
 * the most recently played song is at the top of the stack (O(1) peek/pop).
 */

export class PlaybackHistoryStack<T> {
  private items: T[] = [];
  private readonly maxLimit: number;

  constructor(maxLimit: number = 50, initialItems: T[] = []) {
    this.maxLimit = maxLimit;
    this.items = [...initialItems];
  }

  /**
   * Push newly played track to top of stack - O(1)
   */
  public push(item: T): void {
    this.items.push(item);
    if (this.items.length > this.maxLimit) {
      this.items.shift(); // Evict oldest
    }
  }

  /**
   * Pop most recent track - O(1)
   */
  public pop(): T | null {
    if (this.isEmpty()) return null;
    return this.items.pop() || null;
  }

  /**
   * Peek top track - O(1)
   */
  public peek(): T | null {
    if (this.isEmpty()) return null;
    return this.items[this.items.length - 1];
  }

  public size(): number {
    return this.items.length;
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public clear(): void {
    this.items = [];
  }

  /**
   * Return items from newest to oldest
   */
  public toArray(): T[] {
    return [...this.items].reverse();
  }
}
