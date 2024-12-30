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

// دکمه‌های رپلی کیبورد
const mainMenu = Markup.keyboard([
  ["📋 راهنما"], // دکمه راهنما
])
  .resize() // تغییر اندازه دکمه‌ها
  .oneTime(); // نمایش فقط برای یکبار

// پیام خوش‌آمدگویی و منوی اصلی
bot.start((ctx) => {
  const user = ctx.from;
  const username = user.username ? `@${user.username}` : "ناموجود";
  const userId = user.id;
  const language = user.language_code || "نامشخص";

  const message = `
❤️ سلام به ربات User ID 👤 خوش آمدید 
┈┅┅━┃🤍┃━┅┅┈
👤 اطلاعات اکانت شما به شرح زیر میباشد:

⛓ یوزر نیم: ${username}
🪪 آیدی عددی اکانت شما: ${userId}
🏷 زبان اکانت شما: ${language}
┈┅┅━┃🤍┃━┅┅┈
📢 @MahdyBots
👤 @SeniorMehdy
  `;
  ctx.reply(message, mainMenu);
});

// پاسخ به دکمه "📋 راهنما"
bot.hears("📋 راهنما", (ctx) => {
  const helpMessage = `
❤️ به بخش راهنما خوش آمدید!
┈┅┅━┃🤍┃━┅┅┈
1️⃣ - برای دریافت اطلاعات خود روی /start کلیک کنید
2️⃣ - برای دریافت اطلاعات کانال یک پیام از کانال فوروارد کنید
3️⃣ - برای دریافت اطلاعات شخص یک پیام از شخص فوروارد کنید
┈┅┅━┃🤍┃━┅┅┈
📢 @MahdyBots
👤 @SeniorMehdy
  `;
  ctx.reply(helpMessage, mainMenu);
});

// دریافت اطلاعات پیام فوروارد شده
bot.on("message", (ctx) => {
  const forwardedFrom = ctx.message.forward_from || ctx.message.forward_from_chat;

  if (!forwardedFrom) {
    ctx.reply("❌ لطفاً یک پیام فوروارد شده ارسال کنید.");
    return;
  }

  const isChannel = forwardedFrom.type === "channel";
  const isUser = forwardedFrom.type === "private";

  if (isChannel) {
    // اطلاعات کانال
    const channelInfo = `
📈 اطلاعات پیام فورواردی شما  
┈┅┅━┃🤍┃━┅┅┈
⛓ یوزر نیم کانال: ${forwardedFrom.username ? `@${forwardedFrom.username}` : "ناموجود"}
🪪 آیدی عددی کانال: ${forwardedFrom.id}
🏷 اسم کانال: ${forwardedFrom.title || "ناموجود"}
┈┅┅━┃🤍┃━┅┅┈
📢 @MahdyBots
👤 @SeniorMehdy
    `;
    ctx.reply(channelInfo, mainMenu);
  } else if (isUser) {
    // اطلاعات شخص
    const userInfo = `
📈 اطلاعات پیام فورواردی شما  
┈┅┅━┃🤍┃━┅┅┈
⛓ یوزر نیم شخص: ${forwardedFrom.username ? `@${forwardedFrom.username}` : "ناموجود"}
🪪 آیدی عددی شخص: ${forwardedFrom.id}
🏷 اسم شخص: ${forwardedFrom.first_name || "ناموجود"} ${forwardedFrom.last_name || ""}
┈┅┅━┃🤍┃━┅┅┈
📢 @MahdyBots
👤 @SeniorMehdy
    `;
    ctx.reply(userInfo, mainMenu);
  } else {
    ctx.reply("❌ پیام فوروارد شده از کانال یا شخص نیست.", mainMenu);
  }
});

// راه‌اندازی ربات
bot.launch().then(() => {
  console.log("ربات با موفقیت اجرا شد!");
});

// مدیریت خطاها
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
