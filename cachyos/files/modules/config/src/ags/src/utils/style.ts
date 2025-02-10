import { exec, writeFile } from "astal";
import options from "../options";

const homeDir = exec([...options.sh.cmd, "echo $HOME"]);
const buildDir = `${homeDir}/.config/ags/build`;

const variables = () => [
   //`$indicators_spacing: ${options.bar.indicators.spacing}px;`,
   //`$workspaces_spacing: ${options.bar.workspaces.spacing}px;`,
];

export function getCss(): string {
   const vars = `${buildDir}/variables.scss`;
   const scss = `${buildDir}/main.scss`;
   const css = `${buildDir}/main.css`;

   const fd = exec(`fd ".scss" ${homeDir}/.config/ags/src/scss`);
   const files = fd.split(/\s+/);
   const imports = [vars, ...files].map((f) => `@import '${f}';`);

   exec(`mkdir -p ${buildDir}`);
   writeFile(vars, variables().join("\n"));
   writeFile(scss, imports.join("\n"));
   exec(`sass ${scss} ${css}`);

   return css;
}
