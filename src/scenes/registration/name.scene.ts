import { Scenes } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const nameScene = new Scenes.BaseScene<CustomContext>('name');

nameScene.enter((ctx) => {
    ctx
        .reply('Пожалуйста, представьтесь.')
        .then(data => ctx.session.msgId = data.message_id);
});

nameScene.on('text', (ctx) => {
    ctx.deleteMessage(ctx.session.msgId);
    ctx.session.name = ctx.message.text;
    ctx.deleteMessage();
    ctx.scene.enter('email');
});

export { nameScene };
