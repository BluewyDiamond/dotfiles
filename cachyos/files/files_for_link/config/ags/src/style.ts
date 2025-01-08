import { exec, writeFile } from "astal";
import constants from "./libs/contants";
import options from "./options";

export function getCss(): string {
   const vars = `${constants.tmp}/variables.scss`;
   const scss = `${constants.tmp}/main.scss`;
   const css = `${constants.tmp}/main.css`;

   const fd = exec(`fd ".scss" ${SRC}`);
   const files = fd.split(/\s+/);
   const imports = [vars, ...files].map((f) => `@import '${f}';`);

   exec(`mkdir -p ${constants.tmp}`);
   writeFile(vars, variables().join("\n"));
   writeFile(scss, imports.join("\n"));
   exec(`sass ${scss} ${css}`);

   return css;
}

const variables = () => [
   //`$indicators_spacing: ${options.bar.indicators.spacing}px;`,
   //`$workspaces_spacing: ${options.bar.workspaces.spacing}px;`,
];
