window.onload = function() {
  function addToTerminal() {
    const terminalEmulator = document.getElementById("terminal-emulator");
    const prompt = document.getElementById("active-prompt");
    const inputElement = document.getElementById("user-input");
    const newElement = prompt.cloneNode(true);
    const newDiv = document.createElement("div");
    newDiv.className = "terminal-content";

    const newContent = document.createTextNode(fish);
    newDiv.appendChild(newContent);
    newElement
      .querySelector("input")
      .parentNode.replaceChild(newDiv, newElement.querySelector("input"));

    newElement.removeAttribute("id");
    terminalEmulator.insertBefore(newElement, prompt);
    inputElement.value = "";
  }

  window.addEventListener("keyup", function(e) {
    const isEnterKey = code => code === 13;
    if (isEnterKey(e.keyCode)) {
      addToTerminal();
    }
  });
};

fish = String.raw`
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
`;
