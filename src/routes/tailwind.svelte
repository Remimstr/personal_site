<style global>
  @tailwind base;

  h1 {
    @apply text-3xl;
  }

  h2 {
    @apply text-2xl;
    @apply mt-4;
    @apply mb-4;
  }

  h3 {
    @apply text-xl;
    @apply mt-4;
    @apply mb-4;
  }

  p {
    @apply mt-6;
    @apply mb-6;
    line-height: 1.5;
  }

  ul {
    list-style: circle inside;
    @apply ml-6;
  }

  a {
    @apply text-blue-500;
  }

  pre {
    @apply p-2;
    @apply bg-gray-200;
    white-space: pre-wrap;
    word-break: break-all;
  }

  code {
    @apply bg-gray-200;
  }

  html,
  body,
  main,
  #sapper {
    height: 100%;
  }

  @tailwind components;
  @tailwind utilities;
</style>
