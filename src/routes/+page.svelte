<script lang="ts">
  import Loader from "./components/loader.svelte"; // imports Loader from components
  import {onMount, onDestroy} from "svelte";
  import { writable } from "svelte/store";

  let messages = []; // array to store user and ai messages
  let shouldShowWelcomeMessage = true; // shouldShowWelcomeMessage is true by default to show shouldShouldWelcomeMessage
  let shouldload = false; // shouldload is false by default to not show loader
  
  let messagesStore = writable([]);
  let pollInterval;

  onMount(async () => {
    await loadMessages();
    // Start polling for new messages every 5 seconds
    pollInterval = setInterval(loadMessages, 5000);
  });
  onDestroy(() => {
    // Clear the interval when the component is destroyed
    if (pollInterval) clearInterval(pollInterval);
  });
  async function loadMessages() {// Load messages from JSON file when component mounts
    const response = await fetch('/api/messages', {
      method: 'GET',
    });
    const data = await response.json();
    messagesStore.set(data.messages);}
  function handleKeyDown(event) {
    // function to handle key down
    if (event.key === "Enter" && !event.shiftKey) {
      // condition to check if key pressed is Enter
      event.preventDefault();
      sendMessage(); // if condition is true sendMessage function runs
    }
  }
  function autoResize(event) {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  }
 async function sendMessage() {
    shouldShowWelcomeMessage = false;

    const userInputElement = document.getElementById("userInput");
    //@ts-ignore
    const userInput = userInputElement.value.trim();
    
    if (userInput) {
      const newMessage = { content: userInput, Sender: "User" };
      
      // Update local state
      messagesStore.update(msgs => [...msgs, newMessage]);

      // Send message to server
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMessage)
      });

      //@ts-ignore
      userInputElement.value = "";
      await loadMessages();
    }
  }

  // Subscribe to the store
  messagesStore.subscribe(value => {
    messages = value;
  });
</script>

<svelte:head>
  <title>2Chan</title>
</svelte:head>

<div class="main">
  <div class="chatlog" id="chatlog">
    <div class="welcome-message p-2">
      {#if shouldShowWelcomeMessage}
        <h1 id="hello-message" class="text-5xl">Hello There!</h1>
        <p id="how-to" class="text-2xl">
          This is a totally anonymous chat, you can talk about whatever you
          want!! Just don't say/do anything illegal.
        </p>
      {/if}
    </div>
    {#each messages as userMessage}
      <div class={userMessage.Sender}>
        <div class="senders">
          <h3 class=" pl-2">{userMessage.Sender}:</h3>
        </div>
        <div class="content pl-5 text-gray-200">
          <p>{userMessage.content}</p>
        </div>
      </div>
    {/each}
    <!-- 
    {#if shouldload}
      <div class="loader pl-2 mt-3">
        <Loader />
      </div>
    {/if} -->
  </div>
  <div class="input-area">
    <textarea
      id="userInput"
      placeholder="Enter your message here"
      on:keydown={handleKeyDown}
      on:input={autoResize}
      rows="1"
    ></textarea>
    <button type="button" class="btn" on:click={sendMessage}>Send</button>
  </div>
</div>

<style>
  .senders {
    font-size: 1.6em;
  }
  .content {
    font-size: 1.3em;
  }
  .chatlog {
    height: 88vh;
    overflow-y: scroll;
    margin-bottom: 5px;
  }
  textarea {
    min-height: 8vh;
    max-height: 80px;
    height: 8vh;
    width: 60vw;
    border-radius: 10px;
    border: 1px solid white;
    background-color: #1e1f20;
    color: white;
    padding-left: 15px;
    padding-right: 15px;
    resize: none;
    overflow-y: scroll;
  }
  button {
    border-radius: 10px;
    margin-left: 5px;
  }
  .input-area {
    position: absolute;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
