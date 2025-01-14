import { exec, writeFile } from "astal";

const build = "/home/bluewy/.config/ags/build";

export function getCss(): string {
   const vars = `${build}/variables.scss`;
   const scss = `${build}/main.scss`;
   const css = `${build}/main.css`;

   const fd = exec(`fd ".scss" /home/bluewy/.config/ags`);
   const files = fd.split(/\s+/);
   const imports = [vars, ...files].map((f) => `@import '${f}';`);

   exec(`mkdir -p ${build}`);
   writeFile(vars, variables().join("\n"));
   writeFile(scss, imports.join("\n"));
   exec(`sass ${scss} ${css}`);

   return css;
}

const variables = () => [
   //`$indicators_spacing: ${options.bar.indicators.spacing}px;`,
   //`$workspaces_spacing: ${options.bar.workspaces.spacing}px;`,
];
