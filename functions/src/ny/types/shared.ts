export interface Items<T> {
  items: T;
  size: number;
}

export function isItemsList<T>(o: T | Items<T>): o is Items<T> {
  return (o as Items<T>).items !== undefined;
}

export function isItemsArray<T>(o: Items<T | T[]>): o is Items<T[]> {
  return (o as Items<T[]>).items?.length !== undefined;
}
