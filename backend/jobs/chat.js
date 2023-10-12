// chat.js

async function loadChatGPTAPI() {
  const module = await import("chatgpt");
  return module.ChatGPTAPI;
}

async function chatGPT(message) {
  const ChatGPTAPI = await loadChatGPTAPI();
  const api = new ChatGPTAPI({
    apiKey: process.env.OPENAI_KEY,
    model: "gpt-3.5-turbo-0301",
  });

  const res = await api.sendMessage(message);
  return res.text;
}

module.exports = {
  chatGPT,
};
