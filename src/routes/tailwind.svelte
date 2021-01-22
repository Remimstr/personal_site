<style global>
  @tailwind base;

  :global(h1) {
    @apply text-3xl;
  }

  :global(h2) {
    @apply text-2xl;
    @apply mt-4;
    @apply mb-4;
  }

  :global(h3) {
    @apply text-xl;
    @apply mt-4;
    @apply mb-4;
  }

  :global(p) {
    @apply mt-6;
    @apply mb-6;
    line-height: 1.5;
  }

  :global(ul) {
    list-style: circle inside;
    @apply ml-6;
  }

  :global(a) {
    @apply text-blue-500;
  }

  :global(pre) {
    @apply p-2;
    @apply bg-gray-200;
    white-space: pre-wrap;
    word-break: break-all;
  }

  :global(code) {
    @apply bg-gray-200;
  }

  :global(html,
  body,
  main,
  #sapper) {
    height: 100%;
  }

  @tailwind components;
  @tailwind utilities;
</style>
