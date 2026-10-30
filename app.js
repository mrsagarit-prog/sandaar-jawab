const form = document.querySelector("#chatForm");
const input = document.querySelector("#question");
const sendBtn = document.querySelector("#sendBtn");
const conversation = document.querySelector("#conversation");
const clearBtn = document.querySelector("#clearBtn");
let history = [];

function addMessage(role, content, loading = false) {
  const row = document.createElement("div");
  row.className = `message ${role}`;
  if (role === "assistant") {
    const avatar = document.createElement("div");
    avatar.className = "bot-avatar";
    avatar.textContent = "SJ";
    row.append(avatar);
  }
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;
  if (loading) bubble.textContent = "Soch raha hoon...";
  row.append(bubble);
  conversation.append(row);
  conversation.scrollTop = conversation.scrollHeight;
  return bubble;
}

async function ask(question) {
  const q = question.trim();
  if (!q || sendBtn.disabled) return;
  conversation.querySelector(".welcome")?.remove();
  addMessage("user", q);
  history.push({ role: "user", content: q });
  input.value = "";
  sendBtn.disabled = true;
  const waiting = addMessage("assistant", "", true);

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Kuch problem aa gayi.");
    waiting.textContent = data.answer;
    history.push({ role: "assistant", content: data.answer });
  } catch (error) {
    waiting.textContent = error.message || "Connection issue. Dobara try karo.";
    history.pop();
  } finally {
    sendBtn.disabled = false;
    input.focus();
    conversation.scrollTop = conversation.scrollHeight;
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  ask(input.value);
});
input.addEventListener("keydown", event => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});
document.querySelectorAll(".example").forEach(button => {
  button.addEventListener("click", () => ask(button.dataset.question));
});
clearBtn.addEventListener("click", () => {
  history = [];
  conversation.innerHTML = '<div class="welcome"><div class="bot-avatar">SJ</div><div><b>Haan ji, kya poochhna hai?</b><p>Sawaal bhejo. Gyaan bhi milega, boring lecture nahi.</p></div></div>';
  input.focus();
});
