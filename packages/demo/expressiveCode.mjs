import { astroExpressiveCode, addClassName } from "astro-expressive-code";

// https://github.com/withastro/starlight/discussions/1259#discussioncomment-9253140
export default astroExpressiveCode({
  customConfigPreprocessors: {
    preprocessAstroIntegrationConfig: () => {
      // Add the `not-content` class to all rendered blocks to prevent them from being affected
      // by Starlight's default content styles
      const plugins = [
        {
          name: "Starlight Plugin",
          hooks: {
            postprocessRenderedBlock: ({ renderData }) => {
              addClassName(renderData.blockAst, "not-content");
            },
          },
        },
      ];

      return {
        themeCssSelector: (theme, { styleVariants }) => {
          // If one dark and one light theme are available, and the user has not disabled it,
          // generate theme CSS selectors compatible with Starlight's dark mode switch
          if (styleVariants.length >= 2) {
            const baseTheme = styleVariants[0]?.theme;
            const altTheme = styleVariants.find(
              (v) => v.theme.type !== baseTheme?.type
            )?.theme;
            if (theme === baseTheme || theme === altTheme)
              return `[data-theme='${theme.type}']`;
          }
          // Return the default selector
          return `[data-theme='${theme.name}']`;
        },
        plugins,
      };
    },
  },
});
