document.addEventListener("DOMContentLoaded", () => {
  const menuButton = document.getElementById("menuBtn");
  const mobilePanel = document.getElementById("mobilePanel");

  const closeMenu = () => {
    if (!menuButton || !mobilePanel) return;
    mobilePanel.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    menuButton.textContent = "☰";
  };

  if (menuButton && mobilePanel) {
    menuButton.addEventListener("click", () => {
      const isOpen = mobilePanel.classList.toggle("open");
      menuButton.setAttribute("aria-expanded", String(isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
      menuButton.textContent = isOpen ? "×" : "☰";
    });
    mobilePanel.querySelectorAll("a").forEach(link => link.addEventListener("click", closeMenu));
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeMenu();
    });
    document.addEventListener("click", event => {
      if (!mobilePanel.contains(event.target) && !menuButton.contains(event.target)) closeMenu();
    });
  }

  const form = document.getElementById("rfqForm");
  if (form) {
    form.addEventListener("submit", event => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const fields = [
        ["Name", "full_name"], ["Company", "company_name"],
        ["Business email", "business_email"], ["Country", "country"],
        ["Inquiry category", "category"], ["Product", "product"],
        ["Quantity", "quantity"], ["Destination", "destination"],
        ["Packaging", "packaging"], ["Specifications", "specifications"],
        ["Additional requirements", "additional_requirements"]
      ];

      const lines = ["COCOVANTA — BUSINESS RFQ"];
      for (const [label, key] of fields) {
        const value = String(data.get(key) || "").trim();
        if (value) lines.push(`${label}: ${value}`);
      }
      lines.push("", "This inquiry is subject to supplier, product and commercial confirmation. It is not an order or stock reservation.");
      const message = lines.join("\n");

      const status = document.getElementById("formStatus");
      if (!status) return;
      status.replaceChildren();

      const note = document.createElement("p");
      note.textContent = "Your inquiry is prepared on this device. Choose a channel, review the message and press Send in WhatsApp or your email application. COCOVANTA does not receive the form automatically.";
      status.append(note);

      const actions = document.createElement("div");
      actions.className = "rfq-actions";

      const whatsapp = document.createElement("a");
      whatsapp.className = "btn";
      whatsapp.href = "https://wa.me/6285736277955?text=" + encodeURIComponent(message);
      whatsapp.target = "_blank";
      whatsapp.rel = "noopener noreferrer";
      whatsapp.textContent = "Continue via WhatsApp";
      actions.append(whatsapp);

      const email = document.createElement("a");
      email.className = "btn secondary";
      email.href = "mailto:maulana.bmtrade@gmail.com?subject=" +
        encodeURIComponent("COCOVANTA RFQ — " + (data.get("product") || "Business inquiry")) +
        "&body=" + encodeURIComponent(message);
      email.textContent = "Prepare email";
      actions.append(email);

      status.append(actions);
      status.hidden = false;
      status.setAttribute("role", "status");
      status.setAttribute("aria-live", "polite");
      status.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  // Persistent, keyboard-accessible WhatsApp shortcut. It does not submit data.
  if (!document.querySelector(".wa-float")) {
    const shortcut = document.createElement("a");
    shortcut.className = "wa-float";
    shortcut.href = "https://wa.me/6285736277955?text=" +
      encodeURIComponent("Hello COCOVANTA, I would like to discuss a business inquiry.");
    shortcut.target = "_blank";
    shortcut.rel = "noopener noreferrer";
    shortcut.setAttribute("aria-label", "Contact COCOVANTA on WhatsApp");
    const icon = document.createElement("span");
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = "↗";
    const label = document.createElement("b");
    label.textContent = "WhatsApp";
    shortcut.append(icon, label);
    document.body.append(shortcut);
  }
});
