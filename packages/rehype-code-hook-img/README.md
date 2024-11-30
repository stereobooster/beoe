# @beoe/rehype-code-hook-img

The same as `@beoe/rehype-code-hook`, but specifically designed for hooks that output images (e.g. diagrams).

## TODO

- [ ] try to implement external file strategy (with vfile)
  - `basePath: "src/.generated"`?
  - https://docs.astro.build/en/guides/images/#images-in-markdown-files
  - `loading="lazy" decoding="async"`
  - [`~/.generated/*`](https://github.com/withastro/astro/issues/6490)
- [ ] maybe rename strategies
