import { writeFile } from "fs/promises";

export const onPreBuild = async function ({ utils: { run } }) {
  const res = await fetch("https://d2lang.com/install.sh");
  const text = await res.text();
  await writeFile("~/d2i.sh", text);
  await run.command("~/d2i.sh -s --");
};
