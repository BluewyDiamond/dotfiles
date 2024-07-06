import { Application } from "types/service/applications";
import { bash } from "./bash";

/**
 * run app detached
 */
export default (app: Application) => {
   const exe = app.executable
      .split(/\s+/)
      .filter((str) => !str.startsWith("%") && !str.startsWith("@"))
      .join(" ");

   bash(`${exe} &`);
   app.frequency += 1;
};
