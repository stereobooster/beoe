export const onPreBuild = async function ({ utils: { run } }) {
  await run.command("curl -fsSL https://d2lang.com/install.sh | sh -s --");
};
