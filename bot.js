const { Telegraf, Markup } = require("telegraf");
const express = require("express");

// توکن ربات خود را اینجا قرار دهید
const BOT_TOKEN = "7866951691:AAFGDIrDOwQfR070gtbntjVJT7Y9oZOk1fg";
const bot = new Telegraf(BOT_TOKEN);

// سرور Express.js برای آنلاین نگه داشتن ربات
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("ربات فعال است و آنلاین می‌باشد!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ذخیره زبان کاربران و لیست مدیران
const userLanguages = {};
const admins = [7712384524]; // آیدی مدیران

// منوی زبان
const languageMenu = Markup.keyboard([
  ["فارسی", "English"], // انتخاب زبان
])
  .resize()
  .oneTime();

// منوی اصلی
const mainMenu = (language) =>
  Markup.keyboard(
    language === "فارسی"
      ? [["📋 راهنما", "🆘 پشتیبانی"]]
      : [["📋 Help", "🆘 Support"]]
  )
    .resize()
    .oneTime();

// انتخاب زبان هنگام استارت
bot.start((ctx) => {
  ctx.reply("لطفاً زبان خود را انتخاب کنید:\nPlease select your language:", languageMenu);
});

// تنظیم زبان
bot.hears(["فارسی", "English"], (ctx) => {
  const language = ctx.message.text;
  userLanguages[ctx.from.id] = language;

  const welcomeMessage =
    language === "فارسی"
      ? `
❤️ سلام به ربات User ID 👤 خوش آمدید 
┈┅┅━┃🤍┃━┅┅┈
👤 برای دریافت اطلاعات خود از منوی زیر استفاده کنید.
      `
      : `
❤️ Welcome to the User ID Bot 👤 
┈┅┅━┃🤍┃━┅┅┈
👤 Use the menu below to get your information.
      `;

  ctx.reply(welcomeMessage, mainMenu(language));
});

// مدیریت پیام‌های فوروارد شده
bot.on("message", (ctx) => {
  const forwardedFrom = ctx.message.forward_from || ctx.message.forward_from_chat;
  const language = userLanguages[ctx.from.id] || "فارسی";

  // اگر پیام فوروارد شده باشد
  if (forwardedFrom) {
    if (forwardedFrom.type === "private") {
      const userInfo =
        language === "فارسی"
          ? `
📈 اطلاعات پیام فورواردی شما:
┈┅┅━┃🤍┃━┅┅┈
⛓ یوزر نیم شخص: ${forwardedFrom.username ? `@${forwardedFrom.username}` : "ناموجود"}
🪪 آیدی عددی شخص: ${forwardedFrom.id}
🏷 اسم شخص: ${forwardedFrom.first_name || "ناموجود"} ${forwardedFrom.last_name || ""}
          `
          : `
📈 Forwarded Message Information:
┈┅┅━┃🤍┃━┅┅┈
⛓ Username: ${forwardedFrom.username ? `@${forwardedFrom.username}` : "Not available"}
🪪 User ID: ${forwardedFrom.id}
🏷 Name: ${forwardedFrom.first_name || "Not available"} ${forwardedFrom.last_name || ""}
          `;
      ctx.reply(userInfo, Markup.inlineKeyboard([
        Markup.button.callback("کپی آیدی عددی", `copy_${forwardedFrom.id}`),
        Markup.button.callback("کپی یوزر نیم", `copy_${forwardedFrom.username || "ناموجود"}`),
      ]));
    } else if (forwardedFrom.type === "channel") {
      const channelInfo =
        language === "فارسی"
          ? `
📈 اطلاعات پیام فورواردی شما:
┈┅┅━┃🤍┃━┅┅┈
⛓ یوزر نیم کانال: ${forwardedFrom.username ? `@${forwardedFrom.username}` : "ناموجود"}
🪪 آیدی عددی کانال: ${forwardedFrom.id}
🏷 اسم کانال: ${forwardedFrom.title || "ناموجود"}
          `
          : `
📈 Forwarded Message Information:
┈┅┅━┃🤍┃━┅┅┈
⛓ Channel Username: ${forwardedFrom.username ? `@${forwardedFrom.username}` : "Not available"}
🪪 Channel ID: ${forwardedFrom.id}
🏷 Channel Name: ${forwardedFrom.title || "Not available"}
          `;
      ctx.reply(channelInfo, Markup.inlineKeyboard([
        Markup.button.callback("کپی آیدی عددی", `copy_${forwardedFrom.id}`),
        Markup.button.callback("کپی یوزر نیم", `copy_${forwardedFrom.username || "ناموجود"}`),
      ]));
    }
  } else {
    // اگر پیام فوروارد نشده باشد (یعنی پیام از خود شخص باشد)
    const userInfo =
      language === "فارسی"
        ? `
📈 اطلاعات پیام شما:
┈┅┅━┃🤍┃━┅┅┈
⛓ یوزر نیم شما: ${ctx.from.username ? `@${ctx.from.username}` : "ناموجود"}
🪪 آیدی عددی شما: ${ctx.from.id}
🏷 اسم شما: ${ctx.from.first_name || "ناموجود"} ${ctx.from.last_name || ""}
        `
        : `
📈 Your Message Information:
┈┅┅━┃🤍┃━┅┅┈
⛓ Your Username: ${ctx.from.username ? `@${ctx.from.username}` : "Not available"}
🪪 Your User ID: ${ctx.from.id}
🏷 Your Name: ${ctx.from.first_name || "Not available"} ${ctx.from.last_name || ""}
        `;
    ctx.reply(userInfo, Markup.inlineKeyboard([
      Markup.button.callback("کپی آیدی عددی", `copy_${ctx.from.id}`),
      Markup.button.callback("کپی یوزر نیم", `copy_${ctx.from.username || "ناموجود"}`),
    ]));
  }
});

// مدیریت کلیک روی دکمه‌های کپی
bot.action(/copy_(.+)/, (ctx) => {
  const data = ctx.match[1];
  ctx.reply(`کپی شد: ${data}`);
});

// پشتیبانی
bot.hears("🆘 پشتیبانی", (ctx) => {
  const language = userLanguages[ctx.from.id] || "فارسی";
  const supportMessage =
    language === "فارسی"
      ? "لطفاً پیام خود را برای پشتیبانی ارسال کنید."
      : "Please send your message for support.";
  ctx.reply(supportMessage);
});

// ارسال پیام به مدیر
bot.on("message", (ctx) => {
  if (ctx.message.text && ctx.from.id !== 7712384524) {
    // اگر پیام از کاربر باشد، ارسال به مدیر
    admins.forEach((adminId) => {
      bot.telegram.sendMessage(adminId, `پیام جدید از کاربر ${ctx.from.first_name} (${ctx.from.id}):\n\n${ctx.message.text}`);
    });
  }
});

// پاسخ به پیام از مدیر
bot.on("text", (ctx) => {
  if (admins.includes(ctx.from.id)) {
    // اگر پیام از مدیر باشد، ارسال به کاربر
    const userId = ctx.message.reply_to_message.from.id;
    bot.telegram.sendMessage(userId, `پاسخ مدیر:\n\n${ctx.message.text}`);
  }
});

// راه‌اندازی ربات
bot.launch().then(() => {
  console.log("ربات با موفقیت اجرا شد!");
});

// مدیریت خطاها
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
