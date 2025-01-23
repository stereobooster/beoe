// import { type compile } from "@penrose/core";
import { spawn } from "node:child_process";
import { fileURLToPath } from "url";
import { resolve } from "node:path";
const executablePath = resolve(
  fileURLToPath(import.meta.url),
  `../../bin/penrose.js`
);

// type CompileOptions = Parameters<typeof compile>[0];
type CompileOptions = {
  substance: string;
  style: string;
  domain: string;
  variation: string;
  excludeWarnings?: string[];
  width: number;
  height: number;
};

export const penrose = (opts: CompileOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    let res = "";

    const bin = spawn(executablePath, [], {
      windowsHide: true,
    });
    bin.stdout.on("data", (data: Buffer) => (res += data.toString()));
    bin.stderr.on("data", (data: Buffer) => reject(data.toString()));
    bin.on("close", (code) =>
      code === 0
        ? resolve(res)
        : reject(`child process exited with code ${code}`)
    );

    bin.stdin.write(JSON.stringify(opts));
    bin.stdin.end();
  });
};
