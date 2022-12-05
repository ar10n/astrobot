import { Category } from '@prisma/client';
import { Scenes, Markup } from 'telegraf';
import CustomContext from '../interfaces/custom.context';
import { prisma } from '../prisma/client';
import { splittedArray } from '../helpers/splittedArray';

const categoriesScene = new Scenes.BaseScene<CustomContext>('categories');

let categories: Category[] = [];
let categoriesNames: string[] = [];
let menuCategories: Array<Array<string>> = [];
(async function fetchCategories() {
    categories = await prisma.category.findMany();
    categoriesNames = categories.map(category => category.name);
    menuCategories = splittedArray(categoriesNames, 2);
})();

categoriesScene.enter((ctx) => {
    ctx.reply('Список разделов.', Markup.keyboard(menuCategories).oneTime().resize());
});

categoriesScene.on("text", ctx => {
    const category = categories.find(item => item.name == ctx.update.message.text);
    if (typeof category?.description == "string") {
        ctx.reply(category.description, Markup.inlineKeyboard([
            [Markup.button.callback('Перейти в категорию', `CAT_${category.id.toString()}`)],
            [Markup.button.callback('Вернуться в меню', 'MENU')]
        ]))
    }
})

categoriesScene.action('MENU', (ctx) => {
    ctx.reply('Список разделов.', Markup.keyboard(menuCategories).oneTime().resize());
    ctx.answerCbQuery();
});

categoriesScene.action(/CAT_+/, async (ctx) => {
    ctx.session.currentService = Number(ctx.match.input.substring(4));
    ctx.scene.enter('services')
    ctx.answerCbQuery();
});

// categoriesScene.leave((ctx, next) => {
//     next();
// });
categoriesScene.command("leave", (ctx) => {
    ctx.scene.leave();
});

export { categoriesScene };