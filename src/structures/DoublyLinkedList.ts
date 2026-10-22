/**
 * TuneFlow Doubly Linked List Implementation
 * 
 * Purpose in TuneFlow:
 * Models sequential playlist playback. Each song is a node holding pointers
 * to both next (forward) and previous (backward) tracks, enabling O(1)
 * immediate step traversal without array reindexing.
 */

export class DLLNode<T> {
  data: T;
  next: DLLNode<T> | null = null;
  prev: DLLNode<T> | null = null;
  id: string;

  constructor(data: T, id: string = Math.random().toString(36).substring(2, 9)) {
    this.data = data;
    this.id = id;
  }
}

export class DoublyLinkedList<T> {
  head: DLLNode<T> | null = null;
  tail: DLLNode<T> | null = null;
  current: DLLNode<T> | null = null;
  private _size: number = 0;

  get size(): number {
    return this._size;
  }

  get isEmpty(): boolean {
    return this._size === 0;
  }

  /**
   * Append node at tail - O(1)
   */
  append(data: T, id?: string): DLLNode<T> {
    const newNode = new DLLNode(data, id);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this._size++;
    return newNode;
  }

  /**
   * Prepend node at head - O(1)
   */
  prepend(data: T, id?: string): DLLNode<T> {
    const newNode = new DLLNode(data, id);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      this.current = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }
    this._size++;
    return newNode;
  }

  /**
   * Insert at specific index - O(n)
   */
  insertAt(index: number, data: T, id?: string): DLLNode<T> | null {
    if (index < 0 || index > this._size) return null;
    if (index === 0) return this.prepend(data, id);
    if (index === this._size) return this.append(data, id);

    let curr = this.head;
    for (let i = 0; i < index; i++) {
      if (curr) curr = curr.next;
    }

    if (!curr) return null;
    const newNode = new DLLNode(data, id);
    newNode.prev = curr.prev;
    newNode.next = curr;
    if (curr.prev) curr.prev.next = newNode;
    curr.prev = newNode;
    this._size++;
    return newNode;
  }

  /**
   * Remove a specific node - O(1) if node reference is known
   */
  removeNode(node: DLLNode<T>): boolean {
    if (!node) return false;

    if (node === this.head) {
      this.head = node.next;
      if (this.head) this.head.prev = null;
    } else if (node.prev) {
      node.prev.next = node.next;
    }

    if (node === this.tail) {
      this.tail = node.prev;
      if (this.tail) this.tail.next = null;
    } else if (node.next) {
      node.next.prev = node.prev;
    }

    if (this.current === node) {
      this.current = node.next || node.prev || null;
    }

    this._size--;
    return true;
  }

  /**
   * Remove at index - O(n)
   */
  removeAt(index: number): T | null {
    if (index < 0 || index >= this._size || !this.head) return null;

    let curr = this.head;
    for (let i = 0; i < index; i++) {
      if (curr.next) curr = curr.next;
    }

    const val = curr.data;
    this.removeNode(curr);
    return val;
  }

  /**
   * Navigate forward - O(1)
   */
  next(): T | null {
    if (this.current && this.current.next) {
      this.current = this.current.next;
      return this.current.data;
    }
    return null;
  }

  /**
   * Navigate backward - O(1)
   */
  prev(): T | null {
    if (this.current && this.current.prev) {
      this.current = this.current.prev;
      return this.current.data;
    }
    return null;
  }

  /**
   * Reset current to head - O(1)
   */
  resetToHead(): T | null {
    this.current = this.head;
    return this.head ? this.head.data : null;
  }

  /**
   * Set current node by predicate - O(n)
   */
  setCurrent(predicate: (item: T) => boolean): boolean {
    let curr = this.head;
    while (curr) {
      if (predicate(curr.data)) {
        this.current = curr;
        return true;
      }
      curr = curr.next;
    }
    return false;
  }

  /**
   * Clear list - O(1)
   */
  clear(): void {
    this.head = null;
    this.tail = null;
    this.current = null;
    this._size = 0;
  }

  /**
   * Convert to array - O(n)
   */
  toArray(): { id: string; data: T; isCurrent: boolean }[] {
    const result: { id: string; data: T; isCurrent: boolean }[] = [];
    let curr = this.head;
    while (curr) {
      result.push({
        id: curr.id,
        data: curr.data,
        isCurrent: curr === this.current,
      });
      curr = curr.next;
    }
    return result;
  }
}
