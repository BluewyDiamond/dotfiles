import { Variable } from "astal";
import { Connectable, Subscribable } from "astal/binding";

export default class Hookable {
   private connectedSignals: Array<[Connectable | Subscribable, number]> = [];
   private subscriptions: Array<() => void> = [];
   derives: Set<Variable<any>> = new Set();

   hook(
      object: Connectable,
      signal: string,
      callback: (...args: any[]) => void
   ): this;
   hook(object: Subscribable, callback: (...args: any[]) => void): this;
   hook(
      object: Connectable | Subscribable,
      signalOrCallback: string | ((...args: any[]) => void),
      callback?: (...args: any[]) => void
   ): this {
      if (typeof signalOrCallback === "string" && callback) {
         const signal = signalOrCallback;
         const handlerId = object.connect(signal, callback);
         this.connectedSignals.push([object, handlerId]);
      } else if (typeof signalOrCallback === "function") {
         const unsubscribe = object.subscribe(signalOrCallback);
         this.subscriptions.push(unsubscribe);
      } else {
         throw new Error("Invalid arguments for hook.");
      }

      return this;
   }

   destroy() {
      this.connectedSignals.forEach(([object, handlerId]) => {
         object.disconnect(handlerId);
      });

      this.connectedSignals = [];
      this.subscriptions.forEach((unsubscribe) => unsubscribe());
      this.subscriptions = [];
      this.derives.forEach((variable) => variable.drop());
   }
}
