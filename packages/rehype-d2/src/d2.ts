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
  /**
   * @default 0
   * Set the diagram theme ID.
   */
  theme?: string;
  /**
   * @default -1
   * The theme to use when the viewer's browser is in dark mode.
   * When left unset --theme is used for both light and dark mode.
   * Be aware that explicit styles set in D2 code will still be
   * applied and this may produce unexpected results. We plan on
   * resolving this by making style maps in D2 light/dark mode
   * specific. See https://github.com/terrastruct/d2/issues/831.
   */
  darkTheme?: string;
  /**
   * Set the diagram layout engine to the passed string. For a
   * list of available options, run layout.
   */
  layout?: string;
  /**
   * @default 100
   * Pixels padded around the rendered diagram.
   */
  pad?: number;
  /**
   * @default -1
   * Scale the output. E.g., 0.5 to halve the default size.
   * Default -1 means that SVG's will fit to screen and all others
   * will use their default render size. Setting to 1 turns off
   * SVG fitting to screen.
   */
  scale?: number;
  /**
   * @default false
   * Renders the diagram to look like it was sketched by hand.
   */
  sketch?: boolean;
  /**
   * @default true
   * Bundle all assets and layers into the output svg.
   */
  bundle?: boolean;
  /**
   * Center the SVG in the containing viewbox, such as your
   * browser screen.
   */
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
