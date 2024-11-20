export const onPreBuild = async function ({ utils: { run } }) {
  await run.command("brew install d2");
};
