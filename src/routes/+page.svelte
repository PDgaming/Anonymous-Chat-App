<script>
  import "./chatWindow.css";
  import { onMount } from "svelte";
  import { supabase } from "../subabaseClient";

  let messages = [];

  async function load() {
    const { data, error } = await supabase.from("Chat").select("Messages");
    if (error) {
      console.error("Error fetching messages:", error);
      // Handle the error appropriately
    } else if (data) {
      for (const item of data) {
        if (typeof item.Messages === "string") {
          messages = [...messages, item.Messages];
        }
      }
    } else {
      console.log("No messages found");
    }
    const channels = supabase
      .channel("custom-all-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "Chat" },
        (payload) => {
          if (payload.new.Messages !== undefined || null) {
            messages = [...messages, payload.new.Messages];
          }
        },
      )
      .subscribe();
  }

  onMount(load);

  function handleKeyDown(event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  }

  async function sendMessage() {
    // @ts-ignore
    const userMessage = document.getElementById("userInput").value.trim();
    // @ts-ignore
    document.getElementById("userInput").value = "";

    const { data, error } = await supabase
      .from("Chat")
      .insert({ Messages: userMessage });

    if (error) {
      console.error(error);
    }
  }
</script>

<div class="chatLog">
  <h1>
    This is a totally anonymous chat, you can talk about whatever you want!!
  </h1>
  {#each messages as message}
    <h2>{message}</h2>
    <hr />
  {/each}
</div>
<div class="input-area">
  <input
    type="text"
    id="userInput"
    placeholder="Enter a prompt here"
    on:keydown={handleKeyDown}
  />
  <button type="button" on:click={sendMessage}>Send</button>
</div>

<style>
  h2 {
    margin-top: 5px;
    margin-left: 10px;
  }
  input {
    position: relative;
    top: 15px;
    left: 9vw;
    height: 55px;
    width: 65vw;
    border: 1px solid white;
    border-radius: 25px;
    background-color: #1e1f20;
    color: white;
    padding-left: 15px;
  }
  input:focus {
    border: none;
  }
  button {
    position: relative;
    top: 15px;
    left: 10vw;
    background-color: #131314;
    color: white;
    height: 40px;
    width: 70px;
    border: 1px solid white;
    border-radius: 10px;
  }
  .input-area {
    position: fixed;
    top: 81vh;
    left: 8vw;
    height: 90px;
    width: 85vw;
    background-color: transparent;
  }
  .chatLog {
    overflow-y: scroll;
    overflow-x: hidden;
    height: 90vh;
    padding: 10px;
    background-color: transparent;
    padding-bottom: 100px;
    align-items: center;
  }
  :root {
    @media (prefers-reduced-motion: no-preference) {
      overflow: hidden;
    }
  }

  @media screen and (max-width: 1170px) {
    input {
      left: 8vw;
      height: 10vh;
      width: 65vw;
    }
    button {
      top: 17px;
      left: 9vw;
    }
  }
  @media screen and (max-width: 1090px) {
    button {
      top: 16px;
      left: 7vw;
    }
    input {
      left: 6vw;
      width: 66vw;
    }
  }

  @media screen and (max-width: 1060px) {
    button {
      top: 16px;
      left: 6vw;
    }
    input {
      left: 5vw;
      width: 72vw;
    }
  }

  /* Responsive for tablets */
  @media screen and (max-width: 800px) {
    button {
      top: 16px;
      left: 1vw;
    }
    input {
      left: 0vw;
      width: 75vw;
    }
  }

  /* Responsive for mobiles */
  @media screen and (max-width: 400px) {
    button {
      top: 16px;
      left: -3vw;
    }
    input {
      left: -4vw;
      height: 8vh;
      width: 66vw;
      border-radius: 20px;
    }
  }
  /* Responsive for vivo 1724 */
  @media screen and (max-width: 390px) {
    input {
      width: 64vw;
    }
  }
</style>
