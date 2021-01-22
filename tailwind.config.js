module.exports = {
  purge: ["./**/*.svelte", "./**/*.html"],
  theme: {
    textIndent: (theme, { negative }) => ({
      ...{
        sm: "2rem",
        md: "3rem",
        lg: "4rem",
      },
      ...negative({
        sm: "2rem",
        md: "3rem",
        lg: "4rem",
      }),
    }),
  },
  variants: {},
  plugins: [require("tailwindcss-text-indent")()],
};
