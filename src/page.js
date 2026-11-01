// Shared entry for the simple pages (contact, terms, privacy).
import "./styles.css";

const form = document.getElementById("contact-form");
if (form) {
  const msg = document.getElementById("form-msg");
  const send = document.getElementById("c-send");
  const fallback = 'Email us at <a href="mailto:contact@whi-ff.com">contact@whi-ff.com</a> instead.';

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    msg.className = "form-msg";
    if (!form.checkValidity()) {
      const bad = form.querySelector(":invalid");
      msg.textContent = bad?.name === "email" ? "That email needs another look." : "Please fill in every field.";
      msg.classList.add("is-error");
      bad?.focus();
      return;
    }
    const data = Object.fromEntries(new FormData(form));
    if (data._honey) return; // a bot filled the hidden field

    send.disabled = true;
    send.textContent = "Sending…";
    try {
      // FormSubmit forwards the message to contact@whi-ff.com.
      const res = await fetch("https://formsubmit.co/ajax/contact@whi-ff.com", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          topic: data.topic,
          message: data.message.trim(),
          _replyto: data.email.trim(),
          _subject: `Whiff website: ${data.topic}`,
          _template: "table",
          _captcha: "false",
          _honey: "",
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || String(body.success) !== "true") throw new Error(body.message || res.status);
      form.reset();
      msg.textContent = "Got it. We'll write back soon.";
      msg.classList.add("is-ok");
    } catch {
      msg.innerHTML = `That didn't go through. ${fallback}`;
      msg.classList.add("is-error");
    } finally {
      send.disabled = false;
      send.textContent = "Send message";
    }
  });
}
