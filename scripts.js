import { fileSystem, promptText, generateCommands } from "./data.js";

window.onload = function () {
  function readCommand(incomingCommand, commands) {
    const commandList = incomingCommand.split(" ");
    for (const knownCommand of commands) {
      if (knownCommand.name === commandList[0]) {
        if (commandList.length === 1) {
          try {
            return knownCommand.output();
          } catch (e) {
            return e;
          }
        } else {
          for (const file of fileSystem) {
            if (file.name === commandList[1]) {
              try {
                return knownCommand.output(file);
              } catch (e) {
                return e;
              }
            }
          }
        }
      }
    }
    return `Unknown command ${incomingCommand}`;
  }

  function addToTerminal() {
    const commands = generateCommands(fileSystem);
    const terminalEmulator = document.getElementById("terminal-emulator");
    const prompt = document.getElementById("active-prompt");
    const newElement = prompt.cloneNode(true);
    const inputElement = document.getElementById("user-input");
    const inputCommand = inputElement.value;

    // Reset current prefix and then make a new one
    const promptPrefix = newElement.getElementsByClassName("prompt-prefix")[0];
    promptPrefix.innerHTML = "";
    promptPrefix.appendChild(
      document.createTextNode(`${promptText} ${inputCommand}`)
    );
    const newDiv = document.createElement("div");
    newDiv.className = "terminal-content";

    const newContent = document.createTextNode(
      readCommand(inputCommand, commands)
    );
    newDiv.appendChild(newContent);

    // Don't touch the input element but make a div out the old one
    newElement
      .querySelector("input")
      .parentNode.replaceChild(newDiv, newElement.querySelector("input"));

    newElement.removeAttribute("id");
    terminalEmulator.insertBefore(newElement, prompt);
    inputElement.value = "";
  }

  window.addEventListener("keyup", function (e) {
    const isEnterKey = (code) => code === 13;
    if (isEnterKey(e.keyCode)) {
      addToTerminal();
    }
  });

  // Add the prompt prefix on every active iteration
  const promptPrefix = document
    .getElementById("active-prompt")
    .getElementsByClassName("prompt-prefix")[0];
  promptPrefix.appendChild(document.createTextNode(promptText));

  var inputElement = document.getElementById("user-input");
  inputElement.addEventListener("blur", function () {
    console.log("focusing");
    inputElement.value = "HI";
    document.getElementById("user-input").focus();
    inputElement.focus();
  });
};
