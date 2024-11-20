import { writeFile } from "fs/promises";

export const onPreBuild = async function ({ utils: { run } }) {
  const res = await fetch("https://d2lang.com/install.sh");
  const text = await res.text();
  await run.command(text);
};
