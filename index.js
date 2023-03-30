const { Telegraf, Input } = require("telegraf");
const { message } = require("telegraf/filters");
const axios = require("axios")
const bot = new Telegraf("6266832958:AAEpDxRI7leRBaEx5XfjPCNQTKrFiGikEIg");

bot.start((ctx) => ctx.reply("Welcome /ask /image"));

bot.command("ask", (ctx) => {
  ctx.reply("Please enter your prompt:");

  bot.on(message("text"), async (ctx) => {
    if (ctx.update.message.text.length >= 3) {
      const config = {
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
        data: {
          prompt: ctx.update.message.text,
          max_tokens: 1000,
          model: "text-davinci-003",
          temperature: 0.1,
        }
      };
      axios(config)
        .then((response) => {
         //9 console.log(response.data);
          ctx.reply(response.data.choices[0].text)
        })
        .catch((error) => {
          console.error(error);
        });
    } else ctx.reply("Can't generate with prompt less than there characters")
  });

});


bot.command("image", (ctx) => {
  ctx.reply("Please enter your image prompt:");
  bot.on(message("text"), async (ctx) => {
    if (ctx.update.message.text.length >= 6) {
      ctx.reply("Generating Image")
      const config = {
        method: 'post',
        url: 'https://api.openai.com/v1/images/generations',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
        data: {
          prompt: ctx.update.message.text,
          size: "1024x1024",
          n: 1
        }
      };
      axios(config)
        .then((response) => {
          const url = response.data.data[0].url
          ctx.replyWithPhoto(Input.fromURL(url))
          // ctx.reply(url)
        })
        .catch((error) => {
          console.error(error);
        });
    } else ctx.reply("Can't generate with prompt less than 6 characters")
  });
});




bot.launch();
