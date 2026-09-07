const COOKIE_CONSENT_KEY = "cookieConsentAccepted";

const popupElement = document.getElementById("cookie-popup");
const acceptButton = document.getElementById("accept-cookies");
const closeButton = document.getElementById("close-cookies");

const hasAcceptedCookies = localStorage.getItem(COOKIE_CONSENT_KEY) === "true";

if (hasAcceptedCookies) {
  popupElement.classList.add("hidden");
}

const hidePopup = (storeChoice = false) => {
  if (storeChoice) {
    localStorage.setItem(COOKIE_CONSENT_KEY, "true");
  }

  popupElement.classList.add("hidden");
};

acceptButton.addEventListener("click", () => hidePopup(true));
closeButton.addEventListener("click", () => hidePopup(false));
