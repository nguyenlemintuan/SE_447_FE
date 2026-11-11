<template>
  <div class="chat-widget">
    <button type="button" class="chat-fab" :class="{ 'is-open': isOpen }"
      :aria-label="isOpen ? 'Đóng chat' : 'Mở chat hỗ trợ'" @click="toggleChat">
      <i class="bx" :class="isOpen ? 'bx-x' : 'bx-message-rounded-dots'"></i>
      <span v-if="!isOpen">Chat</span>
    </button>

    <section v-if="isOpen" class="chat-panel" aria-label="Chat hỗ trợ LifeTech">
      <header class="chat-head">
        <span class="bot-avatar"><i class="bx bx-bot"></i></span>
        <div class="bot-info">
          <strong>Trợ lý LifeTech</strong>
          <span class="bot-status"><i></i> Đang trực tuyến</span>
        </div>
        <button type="button" class="head-close" aria-label="Đóng chat" @click="toggleChat">
          <i class="bx bx-x"></i>
        </button>
      </header>

      <div ref="body" class="chat-body">
        <div v-for="(msg, index) in messages" :key="index" class="msg"
          :class="msg.sender === 'Bạn' ? 'is-mine' : 'is-theirs'">
          <span v-if="msg.sender !== 'Bạn'" class="msg-avatar"><i class="bx bx-bot"></i></span>
          <div class="bubble-wrap">
            <span class="msg-author">{{ msg.sender }}</span>
            <div class="bubble">{{ msg.text }}</div>
          </div>
        </div>

        <div v-if="isTyping" class="msg is-theirs">
          <span class="msg-avatar"><i class="bx bx-bot"></i></span>
          <div class="bubble-wrap">
            <span class="msg-author">AI</span>
            <div class="bubble typing">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="quick-options">
        <button v-for="(option, index) in quickReplies" :key="index" type="button"
          class="quick-chip" @click="sendQuickReply(option)">
          <i class="bx" :class="option.icon"></i>
          {{ option.text }}
        </button>
      </div>

      <form class="chat-form" @submit.prevent="sendMessage">
        <input v-model="userInput" type="text" class="chat-input" placeholder="Nhập tin nhắn..."
          aria-label="Nội dung tin nhắn" />
        <button type="submit" class="chat-send" :disabled="!userInput.trim()" aria-label="Gửi tin nhắn">
          <i class="bx bx-send"></i>
        </button>
      </form>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ChatBox",
  data() {
    return {
      userInput: "",
      messages: [
        {
          sender: "AI",
          text: "Xin chào! Tôi là trợ lý LifeTech. Tôi có thể giúp gì cho bạn hôm nay?",
        },
      ],
      isOpen: false,
      isTyping: false,
      quickReplies: [
        {
          text: "Liên hệ hỗ trợ",
          icon: "bx-support",
          reply: "Bạn có thể gọi tổng đài 1900 232 460 (8:00 – 21:30) hoặc gửi email tới support@lifetech.vn để được hỗ trợ.",
        },
        {
          text: "Khuyến mãi",
          icon: "bx-purchase-tag",
          reply: "LifeTech đang có chương trình giảm giá cho đơn hàng đầu tiên. Bạn xem thêm tại trang chủ nhé!",
        },
      ],
    };
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
      if (this.isOpen) this.scrollToBottom();
    },
    async sendMessage() {
      const message = this.userInput.trim();
      if (!message) return;

      this.messages.push({ sender: "Bạn", text: message });
      this.userInput = "";
      this.isTyping = true;
      this.scrollToBottom();

      try {
        const response = await axios.post("http://127.0.0.1:8000/api/customer/chat", {
          message,
        });
        this.messages.push({ sender: "AI", text: response.data.reply });
      } catch (error) {
        console.error("Lỗi chat:", error);
        this.messages.push({
          sender: "AI",
          text: "Xin lỗi, hiện tại tôi chưa thể trả lời. Bạn vui lòng gọi 1900 232 460 để được hỗ trợ.",
        });
      } finally {
        this.isTyping = false;
        this.scrollToBottom();
      }
    },
    sendQuickReply(option) {
      this.messages.push({ sender: "Bạn", text: option.text });
      this.messages.push({ sender: "AI", text: option.reply });
      this.scrollToBottom();
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const body = this.$refs.body;
        if (body) body.scrollTop = body.scrollHeight;
      });
    },
  },
};
</script>

<style scoped>
.chat-widget {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 1200;
  font-family: var(--lt-font);
}

/* ============ FAB ============ */
.chat-fab {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 52px;
  padding: 0 20px;
  border: 0;
  border-radius: 999px;
  cursor: pointer;
  color: #fff;
  font-family: var(--lt-font);
  font-size: 14px;
  font-weight: 700;
  background: linear-gradient(135deg, #fb923c, var(--lt-orange));
  box-shadow: 0 16px 34px -10px rgba(249, 115, 22, 0.65);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.chat-fab i {
  font-size: 22px;
}

.chat-fab:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 40px -10px rgba(249, 115, 22, 0.75);
}

.chat-fab.is-open {
  width: 52px;
  padding: 0;
  justify-content: center;
  background: var(--lt-ink);
  box-shadow: 0 14px 30px -10px rgba(15, 23, 42, 0.6);
}

/* ============ PANEL ============ */
.chat-panel {
  position: absolute;
  right: 0;
  bottom: 66px;
  width: 376px;
  max-width: calc(100vw - 28px);
  height: min(560px, calc(100vh - 130px));
  display: flex;
  flex-direction: column;
  background: var(--lt-surface);
  border: 1px solid var(--lt-line);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 30px 70px -20px rgba(15, 23, 42, 0.4);
  animation: chatIn 0.24s ease;
}

@keyframes chatIn {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.97);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.chat-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  color: #fff;
  background: linear-gradient(135deg, #1c1207, #3b1d05);
}

.bot-avatar {
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 21px;
  color: #fff;
  background: linear-gradient(135deg, #fb923c, var(--lt-orange));
}

.bot-info {
  flex: 1;
  line-height: 1.3;
}

.bot-info strong {
  display: block;
  font-size: 14.5px;
  font-weight: 700;
}

.bot-status {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  color: rgba(255, 255, 255, 0.65);
}

.bot-status i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.25);
}

.head-close {
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.08);
  color: #fff;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.head-close:hover {
  background: rgba(255, 255, 255, 0.16);
}

/* ============ MESSAGES ============ */
.chat-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #f6f7fb;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.msg {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}

.msg.is-mine {
  justify-content: flex-end;
}

.msg-avatar {
  width: 28px;
  height: 28px;
  flex: 0 0 28px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--lt-orange-dark);
  background: var(--lt-orange-soft);
  border: 1px solid var(--lt-orange-line);
}

.bubble-wrap {
  max-width: 78%;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.msg.is-mine .bubble-wrap {
  align-items: flex-end;
}

.msg-author {
  font-size: 10.5px;
  font-weight: 600;
  color: var(--lt-muted);
  letter-spacing: 0.02em;
}

.msg.is-mine .msg-author {
  color: #cbd5e1;
}

.bubble {
  padding: 10px 14px;
  border-radius: 16px;
  font-size: 13.5px;
  line-height: 1.5;
  word-break: break-word;
  white-space: pre-wrap;
}

.msg.is-theirs .bubble {
  background: #fff;
  color: var(--lt-ink);
  border: 1px solid var(--lt-line);
  border-bottom-left-radius: 5px;
}

.msg.is-mine .bubble {
  background: linear-gradient(135deg, #fb923c, var(--lt-orange));
  color: #fff;
  border-bottom-right-radius: 5px;
  box-shadow: 0 8px 18px -8px rgba(249, 115, 22, 0.6);
}

.typing {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 13px 16px;
}

.typing .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--lt-orange);
  animation: blink 1.2s infinite;
}

.typing .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.typing .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes blink {

  0%,
  80%,
  100% {
    opacity: 0.25;
  }

  40% {
    opacity: 1;
  }
}

/* ============ QUICK REPLIES ============ */
.quick-options {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding: 10px 14px 4px;
  background: #fff;
}

.quick-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: 1px solid var(--lt-orange-line);
  background: var(--lt-orange-soft);
  color: var(--lt-orange-dark);
  font-family: var(--lt-font);
  font-size: 12px;
  font-weight: 600;
  padding: 6px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.18s ease;
}

.quick-chip:hover {
  background: var(--lt-orange);
  border-color: var(--lt-orange);
  color: #fff;
}

/* ============ INPUT ============ */
.chat-form {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px 14px;
  background: #fff;
}

.chat-input {
  flex: 1;
  height: 42px;
  border: 1px solid var(--lt-line);
  background: #f8fafc;
  border-radius: 999px;
  padding: 0 16px;
  font-family: var(--lt-font);
  font-size: 13.5px;
  color: var(--lt-ink);
  outline: none;
  transition: border-color 0.18s ease, background 0.18s ease;
}

.chat-input:focus {
  border-color: var(--lt-orange);
  background: #fff;
}

.chat-input::placeholder {
  color: #94a3b8;
}

.chat-send {
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  border: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #fff;
  cursor: pointer;
  background: linear-gradient(135deg, #fb923c, var(--lt-orange));
  transition: transform 0.18s ease, opacity 0.18s ease;
}

.chat-send:hover:not(:disabled) {
  transform: translateY(-1px) scale(1.04);
}

.chat-send:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .chat-widget {
    right: 14px;
    bottom: 14px;
  }

  .chat-panel {
    right: -10px;
    width: calc(100vw - 28px);
    height: min(520px, calc(100vh - 110px));
    border-radius: 18px;
  }
}
</style>
