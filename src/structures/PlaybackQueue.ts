/**
 * TuneFlow Playback Queue (FIFO - First In, First Out)
 * 
 * Purpose in TuneFlow:
 * Maintains upcoming songs selected by the user. As the current track finishes,
 * the next track is dequeued from the front. Users can queue songs to play next
 * or at the end of the queue.
 */

export class PlaybackQueue<T> {
  private items: T[] = [];

  constructor(initialItems: T[] = []) {
    this.items = [...initialItems];
  }

  /**
   * Enqueue to back - O(1)
   */
  public enqueue(item: T): void {
    this.items.push(item);
  }

  /**
   * Play Next (Enqueue at front) - O(n)
   */
  public enqueueFront(item: T): void {
    this.items.unshift(item);
  }

  /**
   * Dequeue next track - O(n) or O(1) amortized
   */
  public dequeue(): T | null {
    if (this.isEmpty()) return null;
    return this.items.shift() || null;
  }

  /**
   * Peek next track without removing - O(1)
   */
  public peek(): T | null {
    if (this.isEmpty()) return null;
    return this.items[0];
  }

  /**
   * Remove specific item by predicate
   */
  public remove(predicate: (item: T) => boolean): boolean {
    const idx = this.items.findIndex(predicate);
    if (idx !== -1) {
      this.items.splice(idx, 1);
      return true;
    }
    return false;
  }

  /**
   * Move item inside queue (drag & drop reorder)
   */
  public move(fromIndex: number, toIndex: number): boolean {
    if (fromIndex < 0 || fromIndex >= this.items.length || toIndex < 0 || toIndex >= this.items.length) {
      return false;
    }
    const [moved] = this.items.splice(fromIndex, 1);
    this.items.splice(toIndex, 0, moved);
    return true;
  }

  public clear(): void {
    this.items = [];
  }

  public size(): number {
    return this.items.length;
  }

  public isEmpty(): boolean {
    return this.items.length === 0;
  }

  public toArray(): T[] {
    return [...this.items];
  }
}
