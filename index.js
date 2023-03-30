// const { Telegraf, Input } = require("telegraf");
// const { message } = require("telegraf/filters");
// const axios = require("axios")
// const bot = new Telegraf("6252282700:AAGLTd11mcys6qwsgzvQ8POoprFgNnkdORA");

// bot.start((ctx) => ctx.reply("Welcome /ask /image"));

// bot.command("ask", (ctx) => {
//   ctx.reply("Please enter your prompt:");
//     if (ctx.update.message.text.length >= 3) {
//       const config = {
//         method: 'post',
//         url: 'https://api.openai.com/v1/completions',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer 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',
//         },
//         data: {
//           prompt: ctx.update.message.text,
//           max_tokens: 1000,
//           model: "text-davinci-003",
//           temperature: 0.1,
//         }
//       };
//       axios(config)
//         .then((response) => {
//          //9 console.log(response.data);
//           ctx.reply(response.data.choices[0].text)
//           return response
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     } else ctx.reply("Can't generate with prompt less than there characters")

// });


// bot.command("image", (ctx) => {
//   ctx.reply("Please enter your image prompt:");
//     if (ctx.update.message.text.length >= 6) {
//       bot.on(message("text"), (ctx) => {
//       ctx.reply("Generating Image")
//       const config = {
//         method: 'post',
//         url: 'https://api.openai.com/v1/images/generations',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer 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',
//         },
//         data: {
//           prompt: ctx.update.message.text,
//           size: "1024x1024",
//           n: 1
//         }
//       };
//       axios(config)
//         .then((response) => {
//           const url = response.data.data[0].url
//           ctx.replyWithPhoto(Input.fromURL(url))
//           return response
//           // ctx.reply(url)
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//       });
//     } else ctx.reply("Can't generate with prompt less than 6 characters")
//   })



// bot.launch();


const { Telegraf, Scenes, session, Markup } = require("telegraf");
const axios = require("axios");
const { Input } = require("telegraf");
const open_ai_key= "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"

const bot = new Telegraf("6252282700:AAGLTd11mcys6qwsgzvQ8POoprFgNnkdORA");
bot.use(session());

// Create ask scene
const askPrompt = new Scenes.WizardScene(
  "askPrompt",
  (ctx) => {
    ctx.reply("Please enter your prompt:");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.update.message.text.length < 3) {
      ctx.reply("Can't generate with prompt less than three characters");
      return ctx.scene.leave();
    }

    const config = {
      method: "post",
      url: "https://api.openai.com/v1/completions",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${open_ai_key}`,
      },
      data: {
        prompt: ctx.update.message.text,
        max_tokens: 1000,
        model: "text-davinci-002",
        temperature: 0.7,
      },
    };

    try {
      const response = await axios(config);
      ctx.reply(response.data.choices[0].text);
    } catch (error) {
      console.error(error);
      ctx.reply(error.message);
    }

    return ctx.scene.leave();
  }
);

// Create image scene
const imagePrompt = new Scenes.WizardScene(
  "imagePrompt",
  (ctx) => {
    ctx.reply("Please enter your image prompt:");
    return ctx.wizard.next();
  },
  async (ctx) => {
    if (ctx.update.message.text.length < 6) {
      ctx.reply("Can't generate with prompt less than six characters");
      return ctx.scene.leave();
    }
      console.log(ctx.update.message.text)
    const config = {
      method: "post",
      url: "https://api.openai.com/v1/images/generations",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${open_ai_key}`,
      },
      data: {
        prompt: ctx.update.message.text,
        size: "1024x1024",
        n: 1,
      },
    };
    ctx.reply("Generating image")

    try {
      const response = await axios(config)
      const url = response.data.data[0].url;
      ctx.replyWithPhoto(Input.fromURL(url));
    } catch (error) {
      console.error(error);
      ctx.reply(error.message);
    }

    return ctx.scene.leave();
  }
);

// Create scene manager
const stage = new Scenes.Stage([askPrompt, imagePrompt]);
bot.use(stage.middleware());

// Create commands
bot.command("ask", (ctx) => ctx.scene.enter("askPrompt"));
bot.command("image", (ctx) => ctx.scene.enter("imagePrompt"));

bot.start((ctx) => ctx.reply("Welcome /ask /image"));

bot.launch();
