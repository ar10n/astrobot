import { Category } from '@prisma/client';
import { Scenes, Markup } from 'telegraf';
import CustomContext from '../interfaces/custom.context';
import { prisma } from '../prisma/client';

const categoriesScene = new Scenes.BaseScene<CustomContext>('categories');

let categories: Category[] = [];
let menuCategories: Array<any> = [];

(async function fetchCategories() {
    categories = await prisma.category.findMany();
    menuCategories = categories.map(category => [Markup.button.callback(category.name, `CAT_${category.id.toString()}`)]);
})();

categoriesScene.enter((ctx) => {
    ctx
        .reply('Список доступных разделов.', Markup.inlineKeyboard(menuCategories))
        .then(data => ctx.session.msgId = data.message_id);
});

categoriesScene.on('text', ctx => {
    ctx.deleteMessage();
    const category = categories.find(item => item.name == ctx.update.message.text);
    if (typeof category?.description == 'string') {
        ctx.reply(category.description, Markup.inlineKeyboard([
            [Markup.button.callback('Перейти в раздел', `CAT_${category.id.toString()}`)],
            [Markup.button.callback('Вернуться в меню', 'MENU')]
        ]));
    }
    ctx.answerCbQuery();
});

categoriesScene.action('MENU', (ctx) => {
    ctx.reply('Список доступных разделов.', Markup.inlineKeyboard(menuCategories));
});

categoriesScene.action(/CAT_+/, async (ctx) => {
    ctx.session.currentService = Number(ctx.match.input.substring(4));
    ctx.scene.enter('services');
    ctx.answerCbQuery();
});

export { categoriesScene };