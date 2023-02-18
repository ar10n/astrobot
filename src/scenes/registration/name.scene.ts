import { Scenes } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const nameScene = new Scenes.BaseScene<CustomContext>('name');

nameScene.enter(async (ctx): Promise<void> => {
    await ctx.reply('Пожалуйста, представьтесь.');
});

nameScene.on('text', async (ctx): Promise<void> => {
    ctx.session.name = ctx.message.text;
    ctx.session.id = ctx.from.id;
    ctx.scene.enter('city');
});

export { nameScene };
