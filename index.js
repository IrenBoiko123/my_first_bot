const TelegramApi = require("node-telegram-bot-api");
const {gameOptions, againOptions} = require("./options")

const token = "7339401968:AAE1x-2uJ3sTBuFZ29GG9Mtyw0DW_Mbna4M";

const bot = new TelegramApi(token, {polling: true});

const chats = {};



const startGame = async (chatId) => {
  await bot.sendMessage(
    chatId,
    `Now the bot is guessing a number from zero to nine and you have to guess it.`
  );
  const randomNumber = Math.floor(Math.random() * 10);
  chats[chatId] = randomNumber;
  await bot.sendMessage(chatId, `Guess!`, gameOptions);
};

const start = () => {
  bot.setMyCommands([
    {command: "/start", description: "Start the bot."},
    {command: "/info", description: "Get information."},
    {command: "/game", description: "Start a game."},
  ]);

  bot.on("message", async (msg) => {
    const text = msg.text;
    const chatId = msg.chat.id;

    if (text === "/start") {
      await bot.sendSticker(
        chatId,
        "https://tlgrm.eu/_/stickers/711/2ce/7112ce51-3cc1-42ca-8de7-62e7525dc332/19.jpg"
      );
      return bot.sendMessage(chatId, `Hello! I am a simple Telegram bot.`);
    }
    if (text === "/info") {
      return bot.sendMessage(
        chatId,
        `Your name is ${msg.from.forst_name} ${msg.last_name}`
      );
    }

    if (text === "/game") {
      return startGame(chatId);
    }
    return bot.sendMessage(chatId, `I dont understand this message. Please try again`);
  });

  bot.on("callback_query", (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;
    if (data === "/again") {
      return startGame(chatId);
    }
    if (data === chats[chatId]) {
      return bot.sendMessage(
        chatId,
        `Congratulations! You've guessed the right number ${chats[chatId]}`,
        againOptions
      );
    } else {
      return bot.sendMessage(
        chatId,
        `Sorry, that's not the correct number. The correct number was ${chats[chatId]}`,
        againOptions
      );
    }
  });
};

start();
