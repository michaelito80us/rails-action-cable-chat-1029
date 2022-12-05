// app/javascript/components/chatroom_subscriptions.js
import Vue from "vue";
import TuborlinksAdapter from "vue-turbolinks";
import { createConsumer } from "@rails/actioncable";

Vue.use(TuborlinksAdapter);
const initChatroomCable = () => {
  const chatroom = document.getElementById("messages");
  if (chatroom) {
    new Vue({
      el: chatroom,
      data: {},
      methods: {
        insertMessageAndScrollDown(data) {
          this.messagesTarget.insertAdjacentHTML("beforeend", data);
          this.messagesTarget.scrollTo(0, this.messagesTarget.scrollHeight);
        },
      },
      mounted() {
        this.messagesTarget = this.$refs.messages;
        this.chatroomIdValue = this.$refs.chatroom.dataset.chatroomidvalue; // the id of the chatroom we are going to subscribe to.
        console.log("Component created");
        console.log(
          `Subscribed to the chatroom with the id ${this.chatroomIdValue}.`
        );
        this.channel = createConsumer().subscriptions.create(
          { channel: "ChatroomChannel", id: this.chatroomIdValue },
          {
            received: (data) => this.insertMessageAndScrollDown(data),
          }
        );
        this.$refs.messageForm.addEventListener("turbo:submit-end", (event) => {
          event.target.reset();
        });
      },
    });
  }
};

export { initChatroomCable };
