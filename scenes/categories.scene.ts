import { Scenes, Markup } from 'telegraf';
import CustomContext from '../interfaces/custom.context';
import { prisma } from '../prisma/client';

const categoriesScene = new Scenes.BaseScene<CustomContext>('categories');
categoriesScene.enter(async (ctx) => {
    const categories = await prisma.category.findMany();
    const categoriesNames: string[] = categories.map(category => category.name);
    const menuCategories: Array<Array<string>> = splittedCategories(categoriesNames, 2);
    ctx.reply('Список разделов.', Markup.keyboard(menuCategories).oneTime().resize());
});
categoriesScene.leave((ctx, next) => {
    next();
});
categoriesScene.command("leave", (ctx) => {
    ctx.scene.leave();
});

function splittedCategories(arr: Array<string>, size: number): Array<Array<string>> {
    const splittedArr: Array<Array<string>> = [];
    while (arr.length > 0) {
        const chunk = arr.splice(0, size);
        splittedArr.push(chunk);
    }
    return splittedArr;
}

export { categoriesScene };