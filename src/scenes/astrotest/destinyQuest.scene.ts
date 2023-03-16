import { Markup, Scenes } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const destinyQuestScene = new Scenes.BaseScene<CustomContext>('destinyQuest');

destinyQuestScene.enter(async (ctx) => {
    await ctx.replyWithHTML(
        'Тебе хотелось бы узнать свое предназначение и кармические задачи?',
        Markup.keyboard(['Да', 'Нет', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
    );
});

destinyQuestScene.on('text', async (ctx) => {
    const userText = ctx.message.text;
    if (userText === 'Да') {
        // Предлагаем услуги
        await ctx.replyWithHTML(
            'Тебе подойдет <b>Кармическая астрология</b> из раздела Астроконсультации.',
            Markup.keyboard(['Вернуться в главное меню']).resize().oneTime()
        );
    } else if (userText === 'Нет') {
        // Переходим в сцену с вопросом о предназначении
        await ctx.scene.enter('relocationQuest');
        await ctx.scene.leave();
    } else if (userText === 'Вернуться в главное меню') {
        await ctx.scene.enter('categories');
        await ctx.scene.leave();
    } else {
        await ctx.replyWithHTML(
            'Пожалуйста, выбери один из ответов в меню.',
            Markup.keyboard(['Да', 'Нет', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
        );
        await ctx.scene.leave();
    }
});

export { destinyQuestScene };