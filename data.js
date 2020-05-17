export let fileSystem = [
  {
    name: "resume",
    openAction: () => (window.location.href = "https://resume.remimstr.com"),
  },
  {
    name: "blog",
    openAction: () => (window.location.href = "https://blog.remimstr.com"),
  },
];

export const generateCommands = (fileSystem) => [
  {
    name: "fish",
    output: () => String.raw`
                 ___
  ___======____=---=)
/T            \_--===)
[ \ (O)   \~    \_-==)
 \      / )J~~    \-=)
  \\___/  )JJ~~~   \)
   \_____/JJJ~~~~    \
   / \  , \J~~~~~     \
  (-\)\=|\\\~~~~       L__
  (\\)  (\\\)_           \==__
   \V    \\\) ===_____   \\\\\\
          \V)     \_) \\\\JJ\J\)
                      /J\JT\JJJJ)
                      (JJJ| \UUU)
                        (UU)

`,
  },
  {
    name: "ls",
    output: () => fileSystem.map((entry) => entry.name).join("  "),
  },
  {
    name: "open",
    output: (file) => {
      if (file) file.openAction();
      else {
        throw "Please supply a valid file to open";
      }
    },
  },
];

export const promptText = "guest@remimstr.com<~>->";
