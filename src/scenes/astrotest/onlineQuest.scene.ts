import { Scenes, Markup } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const onlineQuestScene = new Scenes.BaseScene<CustomContext>('onlineQuest');

onlineQuestScene.enter(async (ctx) => {
    await ctx.replyWithHTML(
        'Тебе подходит онлайн формат консультаций?',
        Markup.keyboard(['Да', 'Нет', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
    );
});

onlineQuestScene.on('text', async (ctx) => {
    const userText = ctx.message.text;
    if (userText === 'Да') {
        // Предлагаем услуги
        await ctx.replyWithHTML(
            'Тебе подойдет Космограмма из раздела Астроконсультации, а также Гайды и Медитации',
            Markup.keyboard(['Вернуться в главное меню']).resize().oneTime()
        );
    } else if (userText === 'Нет') {
        // Предлагаем услуги
        await ctx.replyWithHTML(
            'Тебе подойдет Космограмма из раздела Астроконсультации, а также можешь какое-нибудь Мероприятие (подробности в Афише).',
            Markup.keyboard(['Вернуться в главное меню']).resize().oneTime()
        );
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

export { onlineQuestScene };