document.addEventListener("DOMContentLoaded", () => {
  const accordion = document.querySelector("[data-accordion]");

  if (!accordion) {
    return;
  }

  const items = Array.from(accordion.querySelectorAll(".accordion-item"));

  const setPanelState = (item, open) => {
    const button = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");

    if (!button || !panel) {
      return;
    }

    item.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));

    if (open) {
      panel.hidden = false;
      panel.style.height = "0px";

      requestAnimationFrame(() => {
        panel.style.height = `${panel.scrollHeight}px`;
      });

      const onExpandEnd = (event) => {
        if (event.propertyName !== "height") {
          return;
        }

        panel.style.height = "auto";
        panel.removeEventListener("transitionend", onExpandEnd);
      };

      panel.addEventListener("transitionend", onExpandEnd);
      return;
    }

    panel.style.height = `${panel.scrollHeight}px`;

    requestAnimationFrame(() => {
      panel.style.height = "0px";
    });

    const onCollapseEnd = (event) => {
      if (event.propertyName !== "height") {
        return;
      }

      panel.hidden = true;
      panel.removeEventListener("transitionend", onCollapseEnd);
    };

    panel.addEventListener("transitionend", onCollapseEnd);
  };

  items.forEach((item) => {
    const button = item.querySelector(".accordion-trigger");

    if (!button) {
      return;
    }

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";
      setPanelState(item, !isOpen);
    });
  });

  items.forEach((item) => {
    const button = item.querySelector(".accordion-trigger");
    const panel = item.querySelector(".accordion-panel");

    if (!button || !panel) {
      return;
    }

    const isOpen = button.getAttribute("aria-expanded") === "true";

    if (isOpen) {
      panel.hidden = false;
      panel.style.height = "auto";
    }
  });
});
