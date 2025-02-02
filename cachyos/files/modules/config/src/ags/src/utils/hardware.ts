import { readFileAsync } from "astal";

export type MemoryStats = {
   total: number;
   available: number;
   usage: number;
};

export async function getMemoryStats(): Promise<MemoryStats | null> {
   const meminfo = await readFileAsync("/proc/meminfo");
   let total = null;
   let available = null;

   for (const line of meminfo.split("\n")) {
      if (!line) continue;

      if (total && available) {
         // We have everything, break early
         break;
      }

      let [label, rest] = line.split(":");
      if (!rest) continue;
      rest = rest.trim();

      if (!rest.endsWith("kB")) {
         return null;
      }

      rest = rest.slice(0, -3);
      const amount = parseInt(rest, 10);
      if (isNaN(amount)) continue;

      if (label === "MemTotal") {
         total = amount;
      } else if (label === "MemAvailable") {
         available = amount;
      }
   }

   if (total === null || available === null) {
      return null;
   }

   return {
      total,
      available,
      usage: 1 - available / total,
   };
}

export type CpuStats = {
   total: number;
   idle: number;
};

export async function getCpuStats(): Promise<CpuStats | null> {
   const statFile = await readFileAsync("/proc/stat");
   if (!statFile.startsWith("cpu ")) return null;

   const cpuLine = statFile.slice(4, statFile.indexOf("\n")).trim();
   const stats = cpuLine.split(" ").map((part) => parseInt(part));

   const idle = stats[3] + stats[4];
   const total = stats.reduce((subtotal, curr) => subtotal + curr, 0);

   return {
      total: total,
      idle: idle,
   };
}
