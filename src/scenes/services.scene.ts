import { Scenes, Markup } from 'telegraf';
// import { splittedArray } from '../helpers/splittedArray';
import CustomContext from '../interfaces/custom.context';
import { prisma } from '../prisma/client';
import { Category, Service } from '@prisma/client';
import { categoriesScene } from './categories.scene';

const servicesScene = new Scenes.BaseScene<CustomContext>('services');

let services: Service[] = [];
let categoryId: number;
let category: Category;
let menuServices: Array<any> = [];

servicesScene.enter(async (ctx) => {
    ctx.deleteMessage(ctx.session.msgId);
    categoryId = ctx.session.currentService;
    const findCategory = await prisma.category.findUnique({
        where: {
            id: categoryId,
        }
    });
    if (findCategory) {
        category = findCategory;
        services = await prisma.service.findMany({
            where: {
                categoryId: categoryId,
            },
        });
        menuServices = services.map(service => [Markup.button.callback(service.name, `SERVICE_${service.id.toString()}`)]);
        menuServices.push([Markup.button.callback('Вернуться в меню', 'MENU')]);
    }
    // const servicesNames: string[] = services.map(service => service.name);
    // const menuServices: Array<Array<string>> = splittedArray(servicesNames, 2);
    ctx.reply(`Услуги раздела ${category?.name}.`, Markup.inlineKeyboard(menuServices));
});

servicesScene.action('MENU', (ctx) => {
    ctx.deleteMessage();
    ctx.scene.enter('categories');
    ctx.answerCbQuery();
});

export { servicesScene };
