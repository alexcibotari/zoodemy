export interface Result<T> {
  count: number;
  next?: string;
  previous?: string;
  results: Array<T>;
}
