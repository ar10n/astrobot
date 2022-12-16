import { Scenes } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const emailScene = new Scenes.BaseScene<CustomContext>('email');

emailScene.enter((ctx) => {
    ctx
        .reply('Пожалуйста, введите email.')
        .then(data => ctx.session.msgId = data.message_id);
});

emailScene.on('text', (ctx) => {
    ctx.deleteMessage(ctx.session.msgId);
    ctx.session.email = ctx.message.text;
    ctx.deleteMessage();
    ctx.scene.enter('categories');
});

export { emailScene };
