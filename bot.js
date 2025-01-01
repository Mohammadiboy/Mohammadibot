const { Telegraf, Markup } = require("telegraf");
const express = require("express");

// توکن ربات خود را اینجا قرار دهید
const BOT_TOKEN = "7580908338:AAFKY9YkpPab4dPwpmwUhuyKSEQBMneWpxI";
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

// ذخیره زبان کاربران
const userLanguages = {};

// منوی زبان
const languageMenu = Markup.keyboard([
  ["فارسی", "English"], // انتخاب زبان
])
  .resize()
  .oneTime();

// منوی اصلی
const mainMenu = (language) =>
  Markup.keyboard(
    language === "فارسی" ? [["📋 راهنما"]] : [["📋 Help"]]
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
📢 @MohammadiBots
👤 @AqaiMohammadi
      `
      : `
❤️ Welcome to the User ID Bot 👤 
┈┅┅━┃🤍┃━┅┅┈
👤 Use the menu below to get your information.
📢 @MohammadiBots
👤 @AqaiMohammadi
      `;

  ctx.reply(welcomeMessage, mainMenu(language));
});

// دستور /info
bot.command("info", (ctx) => {
  const user = ctx.from;
  const username = user.username ? `@${user.username}` : "ناموجود";
  const userId = user.id;
  const userLanguage = user.language_code || "نامشخص";

  const language = userLanguages[ctx.from.id] || "فارسی";

  const userInfo =
    language === "فارسی"
      ? `
❤️ اطلاعات اکانت شما:
┈┅┅━┃🤍┃━┅┅┈
⛓ یوزر نیم: ${username}
🪪 آیدی عددی: ${userId}
🏷 زبان اکانت: ${userLanguage}
┈┅┅━┃🤍┃━┅┅┈
📢 @MohammadiBots
👤 @AqaiMohammadi
      `
      : `
❤️ Your Account Information:
┈┅┅━┃🤍┃━┅┅┈
⛓ Username: ${username}
🪪 User ID: ${userId}
🏷 Language: ${userLanguage}
┈┅┅━┃🤍┃━┅┅┈
📢 @MohammadiBots
👤 @AqaiMohammadi
      `;

  ctx.reply(userInfo);
});

// دستور جدید /about
bot.command("about", (ctx) => {
  const language = userLanguages[ctx.from.id] || "فارسی";

  const aboutMessage =
    language === "فارسی"
      ? `
❤️ درباره ربات:
این ربات برای دریافت اطلاعات کاربر و پیام‌های فوروارد شده طراحی شده است.
┈┅┅━┃🤍┃━┅┅┈
📢 @MohammadiBots
👤 @AqaiMohammadi
      `
      : `
❤️ About the Bot:
This bot is designed to retrieve user information and forwarded message details.
┈┅┅━┃🤍┃━┅┅┈
📢 @MohammadiBots
👤 @AqaiMohammadi
      `;

  ctx.reply(aboutMessage);
});

// پاسخ به دکمه "📋 راهنما" یا "📋 Help"
bot.hears(["📋 راهنما", "📋 Help"], (ctx) => {
  const language = userLanguages[ctx.from.id] || "فارسی";

  const helpMessage =
    language === "فارسی"
      ? `
❤️ به بخش راهنما خوش آمدید!
┈┅┅━┃🤍┃━┅┅┈
1️⃣ - برای دریافت اطلاعات خود روی /info کلیک کنید.
2️⃣ - برای دریافت اطلاعات کانال یک پیام از کانال فوروارد کنید.
3️⃣ - برای دریافت اطلاعات شخص یک پیام از شخص فوروارد کنید.
4️⃣ - برای مشاهده درباره ربات از دستور /about استفاده کنید.
      `
      : `
❤️ Welcome to the Help Section!
┈┅┅━┃🤍┃━┅┅┈
1️⃣ - Click /info to get your account information.
2️⃣ - Forward a message from a channel to get its details.
3️⃣ - Forward a message from a person to get their details.
4️⃣ - Use /about to see information about the bot.
      `;

  ctx.reply(helpMessage, mainMenu(language));
});

// دریافت اطلاعات پیام فوروارد شده
bot.on("message", (ctx) => {
  const forwardedFrom = ctx.message.forward_from || ctx.message.forward_from_chat;
  const language = userLanguages[ctx.from.id] || "فارسی";

  if (!forwardedFrom) {
    ctx.reply(language === "فارسی" ? "❌ لطفاً یک پیام فوروارد شده ارسال کنید." : "❌ Please forward a message.");
    return;
  }

  if (forwardedFrom.type === "private") {
    const userInfo =
      language === "فارسی"
        ? `
📈 اطلاعات پیام فورواردی شما  
┈┅┅━┃🤍┃━┅┅┈
⛓ یوزر نیم شخص: ${forwardedFrom.username ? `@${forwardedFrom.username}` : "ناموجود"}
🪪 آیدی عددی شخص: ${forwardedFrom.id}
🏷 اسم شخص: ${forwardedFrom.first_name || "ناموجود"} ${forwardedFrom.last_name || ""}
📢 @MohammadiBots
👤 @AqaiMohammadi
        `
        : `
📈 Forwarded Message Information  
┈┅┅━┃🤍┃━┅┅┈
⛓ Username: ${forwardedFrom.username ? `@${forwardedFrom.username}` : "Not available"}
🪪 User ID: ${forwardedFrom.id}
🏷 Name: ${forwardedFrom.first_name || "Not available"} ${forwardedFrom.last_name || ""}
📢 @MohammadiBots
👤 @AqaiMohammadi
        `;
  } else if (forwardedFrom.type === "channel") {
    ctx.reply(language === "فارسی" ? `
📈 اطلاعات پیام فورواردی شما  
┈┅┅━┃🤍┃━┅┅┈
⛓ یوزر نیم کانال: ${forwardedFrom.username ? `@${forwardedFrom.username}` : "ناموجود"}
🪪 آیدی عددی کانال: ${forwardedFrom.id}
🏷 اسم کانال: ${forwardedFrom.title || "ناموجود"}
📢 @MohammadiBots
👤 @AqaiMohammadi
    ` : `
📈 Forwarded Message Information  
┈┅┅━┃🤍┃━┅┅┈
⛓ Channel Username: ${forwardedFrom.username ? `@${forwardedFrom.username}` : "Not available"}
🪪 Channel ID: ${forwardedFrom.id}
🏷 Channel Name: ${forwardedFrom.title || "Not available"}
📢 @MohammadiBots
👤 @AqaiMohammadi
    `);
  } else {
    ctx.reply(language === "فارسی" ? "❌ پیام فوروارد شده از کانال یا شخص نیست." : "❌ The forwarded message is not from a channel or person.");
  }
});

// راه‌اندازی ربات
bot.launch().then(() => {
  console.log("ربات با موفقیت اجرا شد!");
});

// مدیریت خطاها
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));