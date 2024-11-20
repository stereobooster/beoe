export const onPreBuild = async function ({ utils: { run } }) {
  await run.command("HOMEBREW_NO_AUTO_UPDATE=1 brew install d2");
};
