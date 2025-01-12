import { Subscribable } from "astal/binding";
import Hookable from "../../libs/Hookable";
import { Variable } from "astal";

export class AppMapp extends Hookable implements Subscribable {
   searchQuery = Variable("");

   constructor() {
      super();
   }

   [key: string]: any;
   subscribe(callback: (value: unknown) => void): () => void {
      throw new Error("Method not implemented.");
   }
   get(): unknown {
      throw new Error("Method not implemented.");
   }
}
