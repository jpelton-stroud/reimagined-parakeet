export interface Items<T> {
  items: T;
  size: number;
}

export function isItemsList<T>(o: unknown | unknown[]): o is Items<T[]> {
  return (o as Items<T[]>).items.length !== undefined;
}
