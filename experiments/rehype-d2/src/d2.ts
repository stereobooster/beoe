import { spawn } from "node:child_process";

// https://github.com/stereobooster/venn-nodejs/blob/main/index.js
export function exec(
  command: string,
  args: string[],
  stdin?: string,
  cwd?: string
) {
  return new Promise<string[]>((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: [],
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

      resolve(output);
    });

    if (stdin) {
      child.stdin.write(stdin);
      child.stdin.end();
    }
  });
}

// extraArgs.push(`--dark-theme=${attributes.darkTheme ?? config.theme.dark}`);
// await exec(
//   "d2",
//   [
//     `--layout=${attributes.layout ?? config.layout}`,
//     `--theme=${attributes.theme ?? config.theme.default}`,
//     `--sketch=${attributes.sketch ?? config.sketch}`,
//     `--pad=${attributes.pad ?? config.pad}`,
//     ...extraArgs,
//     "-",
//     outputPath,
//   ],
//   input,
//   cwd
// );
