import { Variable } from "astal";
import type { Subscribable } from "astal/binding";

export abstract class EfficientRenderingMap<K, V, T>
   implements Subscribable<T[]>
{
   protected readonly map: Map<K, V> = new Map<K, V>();
   protected readonly variable: Variable<T[]> = Variable([]);

   get(): T[] {
      return this.variable.get();
   }

   subscribe(callback: (list: T[]) => void): () => void {
      return this.variable.subscribe(callback);
   }

   destroy(): void {
      this.variable.drop();
   }

   protected abstract notify(): void;
}

export abstract class EfficientRenderingArray<K, V, T>
   implements Subscribable<T[]>
{
   protected readonly array: Array<{ key: K; value: V }> = [];
   protected readonly variable: Variable<T[]> = Variable([]);

   get(): T[] {
      return this.variable.get();
   }

   subscribe(callback: (list: T[]) => void): () => void {
      return this.variable.subscribe(callback);
   }

   destroy(): void {
      this.variable.drop();
   }

   protected abstract notify(): void;
}
