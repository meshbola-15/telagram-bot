// import Telegraf from "telegraf";
// import { apiKey, completions } from "openai";

const { Telegraf } = require("telegraf");
const { Configuration, OpenAIApi } = require("openai");
const { message } = require("telegraf/filters");

const configuration = new Configuration({
  apiKey: "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",
});

// async function getData(ctx) {
//   //   console.warn(ctx);
//   const res = await openai.createCompletion({
//     model: "text-davinci-003",
//     prompt: ctx.update.message.text,
//     temperature: 0.1,
//     max_tokens: 1024,
//     top_p: 1,
//     n: 1,
//     stream: false,
//     logprobs: null,
//     stop: "\n",
//   });

//   //   console.log(res);

//   const message = res;
//   ctx.reply(ctx.update.message.text + message);
//   console.log(ctx.update.message.text + message);
// }

const openai = new OpenAIApi(configuration);
const bot = new Telegraf("6266832958:AAEpDxRI7leRBaEx5XfjPCNQTKrFiGikEIg");

bot.start((ctx) => ctx.reply("Welcome"));

bot.command("chat", (ctx) => {
  ctx.reply("Please enter your prompt:");
});

bot.on(message("text"), async (ctx) => {
  const res = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: ctx.update.message.text,
    temperature: 0.1,
    max_tokens: 1024,
    top_p: 1,
    n: 1,
    stream: false,
    logprobs: null,
    stop: "\n",
  });

  //   console.log(res);

  const message = res;
  ctx.reply(ctx.update.message.text + message);
  console.log(ctx.update.message.text + message);
//   getData(ctx);
});

bot.launch();
