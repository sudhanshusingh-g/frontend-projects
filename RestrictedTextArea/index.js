const textArea = document.getElementById("restricted-textarea");
const charCount = document.getElementById("char-count");
const errorMessage = document.getElementById("error-message");

const MAX_CHARACTERS = 250;

const updateCounter = () => {
  const currentLength = textArea.value.length;
  charCount.textContent = `${currentLength} / ${MAX_CHARACTERS}`;
  const isAtLimit = currentLength === MAX_CHARACTERS;

  textArea.classList.toggle("error", isAtLimit);
  charCount.classList.toggle("error", isAtLimit);
};

textArea.addEventListener("input", () => {
  const currentLength = textArea.value.length;
  if (currentLength > MAX_CHARACTERS) {
    textArea.value = textArea.value.substring(0, MAX_CHARACTERS);
  }

  updateCounter();
});

updateCounter();
