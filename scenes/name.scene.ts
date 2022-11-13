import { Scenes } from 'telegraf';
import CustomContext from '../interfaces/custom.context';

const nameScene = new Scenes.BaseScene<CustomContext>('name');
nameScene.enter((ctx) => ctx.reply('Пожалуйста, представьтесь.'));
nameScene.on("text", (ctx) => {
    ctx.session.name = ctx.message.text;
    ctx.scene.enter('email');
});

export { nameScene };