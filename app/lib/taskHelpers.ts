import type {Task} from "../type/task";

export function matchesTaskProperty<K extends keyof Task>(
  task: Task,
  key: K,
  searchValue: Task[K],
): boolean {
  return task[key] === searchValue;
}

export function getLength<T extends {length: number}>(value: T): number {
  return value.length;
}
getLength("TaskFlow");
