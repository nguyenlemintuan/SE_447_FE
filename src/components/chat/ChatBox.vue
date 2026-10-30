<template>
  <div>
    <!-- Nút mở chat -->
    <div class="chat-toggle" @click="toggleChat">
      <span v-if="!isOpen">💬 Chat</span>
      <span v-else>✖</span>
    </div>

    <!-- Hộp chat -->
    <div v-if="isOpen" class="chat-container">
      <h2>Chat với AI</h2>
      <div class="chat-box">
        <div v-for="(msg, index) in messages" :key="index" class="message">
          <strong>{{ msg.sender }}:</strong> {{ msg.text }}
        </div>
        <!-- Hiển thị đang gõ -->
        <div v-if="isTyping" class="message typing">
          <strong>AI:</strong> <span class="dot"></span><span class="dot"></span><span class="dot"></span>
        </div>
      </div>

      <div class="quick-options">
        <button v-for="(option, index) in quickReplies" :key="index" @click="sendQuickReply(option)">
          {{ option.text }}
        </button>
      </div>

      <div class="input-container">
        <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Nhập tin nhắn..." />
        <button @click="sendMessage">Gửi</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userInput: "",
      messages: [
        { sender: "AI", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
      ],
      isOpen: false,
      isTyping: false,
      quickReplies: [
        {
          text: "Liên hệ hỗ trợ",
          reply: "Bạn có thể liên hệ hỗ trợ qua email: support@example.com",
        },
        {
          text: "Khuyến mãi",
          reply:
            "Chúng tôi đang có chương trình giảm giá 20% cho đơn hàng đầu tiên!",
        },
      ],
    };
  },
  methods: {
    toggleChat() {
      this.isOpen = !this.isOpen;
    },
    async sendMessage() {
      if (!this.userInput.trim()) return;

      // Thêm tin nhắn của người dùng
      this.messages.push({ sender: "Bạn", text: this.userInput });

      const messageToSend = this.userInput;
      this.userInput = ""; // Xóa input ngay lập tức

      // Hiển thị đang gõ
      this.isTyping = true;

      try {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/customer/chat",
          {
            message: messageToSend,
          }
        );

        // Ẩn đang gõ
        this.isTyping = false;

        // Thêm tin nhắn AI
        this.messages.push({ sender: "AI", text: response.data.reply });
      } catch (error) {
        this.isTyping = false;
        console.error("Lỗi:", error);
        this.messages.push({
          sender: "AI",
          text: "Xin lỗi, đã xảy ra lỗi khi gửi tin nhắn.",
        });
      }

      this.$nextTick(() => {
        // Cuộn xuống cuối chat
        const chatBox = this.$el.querySelector(".chat-box");
        chatBox.scrollTop = chatBox.scrollHeight;
      });
    },
    sendQuickReply(option) {
      this.messages.push({ sender: "Bạn", text: option.text });
      this.messages.push({ sender: "AI", text: option.reply });
    },
  },
};
</script>

<style>
/* ======= LAYER CHỐNG BỊ CHE TUYỆT ĐỐI ======= */
.chat-toggle,
.chat-container {
  position: fixed !important;
  z-index: 2147483647 !important;
  /* max browser */
  isolation: isolate;
}

/* ======= NÚT CHAT ======= */
.chat-toggle {
  bottom: 22px;
  right: 26px;
  background: linear-gradient(90deg, #ff7a18, #ff3d77);
  color: #fff;
  padding: 13px 20px;
  border-radius: 40px;
  cursor: pointer;
  font-size: 14px;
  box-shadow: 0 14px 40px rgba(255, 80, 120, .45);
  transition: .25s;
}

.chat-toggle:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 50px rgba(255, 80, 120, .6);
}

/* ======= KHUNG CHAT ======= */
.chat-container {
  bottom: 85px;
  right: 26px;
  width: 380px;
  background: #fff;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 30px 80px rgba(0, 0, 0, .45);
  animation: chatOpen .28s ease;
}

@keyframes chatOpen {
  from {
    opacity: 0;
    transform: translateY(40px) scale(.9);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ======= HEADER ======= */
.chat-container h2 {
  margin: 0;
  padding: 16px;
  background: linear-gradient(90deg, #ff7a18, #ff3d77);
  color: #fff;
  text-align: center;
  font-size: 15px;
  letter-spacing: .4px;
}

/* ======= CHAT BOX ======= */
.chat-box {
  height: 350px;
  overflow-y: auto;
  padding: 15px;
  background: #f6f7fb;
}

/* ======= MESSAGE ======= */
.message {
  max-width: 75%;
  padding: 11px 15px;
  margin: 6px 0;
  border-radius: 18px;
  font-size: 14px;
  animation: fadeIn .2s ease;
}

.message:nth-child(odd) {
  background: #fff;
  border-bottom-left-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, .07);
}

.message:nth-child(even) {
  background: linear-gradient(90deg, #ff7a18, #ff3d77);
  color: #fff;
  margin-left: auto;
  border-bottom-right-radius: 6px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ======= TYPING ======= */
.typing .dot {
  width: 6px;
  height: 6px;
  background: #ff4d6d;
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  animation: blink 1.4s infinite;
}

.typing .dot:nth-child(2) {
  animation-delay: .2s
}

.typing .dot:nth-child(3) {
  animation-delay: .4s
}

@keyframes blink {

  0%,
  80%,
  100% {
    opacity: 0
  }

  40% {
    opacity: 1
  }
}

/* ======= QUICK ======= */
.quick-options {
  display: flex;
  gap: 8px;
  padding: 10px;
  background: #fff;
}

.quick-options button {
  flex: 1;
  border: 1px solid #eee;
  padding: 8px;
  border-radius: 10px;
  background: #fafafa;
  cursor: pointer;
  font-size: 13px;
  transition: .2s;
}

.quick-options button:hover {
  background: linear-gradient(90deg, #ff7a18, #ff3d77);
  color: #fff;
  border-color: transparent;
}

/* ======= INPUT ======= */
.input-container {
  display: flex;
  padding: 10px;
  border-top: 1px solid #eee;
  background: #fff;
}

.input-container input {
  flex: 1;
  border: 1px solid #eee;
  background: #fafafa;
  padding: 10px 14px;
  border-radius: 25px;
  outline: none;
  transition: .2s;
}

.input-container input:focus {
  border-color: #ff5a5f;
  background: #fff;
}

.input-container button {
  margin-left: 8px;
  border: none;
  background: linear-gradient(90deg, #ff7a18, #ff3d77);
  color: white;
  padding: 10px 18px;
  border-radius: 25px;
  cursor: pointer;
  transition: .25s;
}

.input-container button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255, 80, 120, .45);
}
</style>
