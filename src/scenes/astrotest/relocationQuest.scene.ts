import { Markup, Scenes } from 'telegraf';
import CustomContext from '../../interfaces/custom.context';

const relocationQuestScene = new Scenes.BaseScene<CustomContext>('relocationQuest');

relocationQuestScene.enter(async (ctx) => {
    await ctx.replyWithHTML(
        'Хочешь, я рассчитаю благоприятные места для переезда, жизни или отдыха?',
        Markup.keyboard(['Да', 'Нет', 'Вернуться в главное меню'], { columns: 2 }).resize().oneTime()
    );
});

relocationQuestScene.on('text', async (ctx) => {
    const userText = ctx.message.text;
    if (userText === 'Да') {
        // Предлагаем услуги
        await ctx.replyWithHTML(
            'Тебе подойдет <b>Релокация</b> из раздела Астроконсультации.',
            Markup.keyboard(['Вернуться в главное меню']).resize().oneTime()
        );
    } else if (userText === 'Нет') {
        // Предлагаем обратиться напрямую к астрологу
        await ctx.replyWithHTML(
            'Обратитесь напрямую к астрологу за дополнительной консультацией. Контакты можно найти в разделе <b>Сотрудничество</b>.',
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

export { relocationQuestScene };