import { spawn } from "node:child_process";

// https://github.com/stereobooster/venn-nodejs/blob/main/index.js
export function exec(
  command: string,
  args: string[],
  stdin?: string,
  cwd?: string
) {
  return new Promise<string>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: [],
      windowsHide: true,
    });

    const output: string[] = [];
    let errorMessage = `Unable to run command: '${command} ${args.join(" ")}'.`;

    child.stdout.on("data", (data: Buffer) => {
      const lines = data
        .toString()
        .split("\n")
        .filter((line) => line.length > 0);

      output.push(...lines);
    });

    child.stderr.on("data", (data: Buffer) => {
      errorMessage += `\n${data.toString()}`;
    });

    child.on("error", (error) => {
      reject(new Error(errorMessage, { cause: error }));
    });

    child.on("close", (code) => {
      if (code !== 0) {
        reject(new Error(errorMessage));

        return;
      }

      resolve(output.join(""));
    });

    if (stdin) {
      child.stdin.write(stdin);
      child.stdin.end();
    }
  });
}

export type D2Options = {
  theme?: string;
  darkTheme?: string;
  layout?: string;
  pad?: number;
  scale?: number;
  sketch?: boolean;
  bundle?: boolean;
  center?: boolean;
};

export function d2(code: string, options?: D2Options) {
  const args = [];

  if (options?.theme) args.push(`--theme=${options.theme}`);
  // if (options?.darkTheme) args.push(`--dark-theme=${options.darkTheme}`);
  if (options?.layout) args.push(`--layout=${options.layout}`);
  if (options?.pad !== undefined) args.push(`--pad=${options.pad}`);
  if (options?.scale) args.push(`--scale=${options.scale}`);
  if (options?.sketch) args.push(`--sketch`);
  if (options?.bundle) args.push(`--bundle`);
  if (options?.center) args.push(`--center`);

  return exec("d2", [...args, "-"], code);
}