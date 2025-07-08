import { Variable } from "astal";
import { Connectable } from "astal/binding";

function isVariable<T>(obj: any): obj is Variable<T> {
   return (
      obj &&
      typeof obj.subscribe === "function" && // Check for the subscribe method
      typeof obj.get === "function" && // Check for the get method
      typeof obj.set === "function" // Check for the set method
   );
}

export default class Trackable {
   protected readonly signals = new Map<number, Connectable>();
   protected readonly unsubscribables = new Set<() => void>();
   protected readonly variables = new Set<Variable<any>>();

   track(item: [number, Connectable] | (() => void) | Variable<any>) {
      if (Array.isArray(item)) {
         this.signals.set(item[0], item[1]);
      } else if (typeof item === "function") {
         this.unsubscribables.add(item);
      } else if (isVariable(item)) {
         this.variables.add(item);
      }
   }

   destroy(): void {
      this.signals.forEach((connectable, id) => {
         connectable.disconnect(id);
      });

      this.unsubscribables.forEach((unsubscribable) => {
         unsubscribable();
      });

      this.variables.forEach((variable) => {
         variable.drop();
      });
   }
}
