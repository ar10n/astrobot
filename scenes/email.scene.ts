import { Scenes } from 'telegraf';
import CustomContext from '../interfaces/custom.context';

const emailScene = new Scenes.BaseScene<CustomContext>('email');
emailScene.enter((ctx) => ctx.reply('Пожалуйста, введите email.'));
emailScene.leave((ctx, next) => {
    next();
});
emailScene.on("text", (ctx) => {
    ctx.session.email = ctx.message.text;
    ctx.reply(`Спасибо, ${ctx.session.name}!`);
    ctx.scene.enter('categories');
});

export { emailScene };