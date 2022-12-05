import { Service } from '@prisma/client';
import { Scenes, Markup } from 'telegraf';
import { splittedArray } from '../helpers/splittedArray';
import CustomContext from '../interfaces/custom.context';
import { prisma } from '../prisma/client';

const servicesScene = new Scenes.BaseScene<CustomContext>('services');

servicesScene.enter(async (ctx) => {
    const categoryId: number = ctx.session.currentService;
    const services = await prisma.service.findMany({
        where: {
            categoryId: categoryId,
        },
    });
    const servicesNames: string[] = services.map(service => service.name);
    const menuServices: Array<Array<string>> = splittedArray(servicesNames, 2);
    ctx.reply('Список разделов.', Markup.keyboard(menuServices).oneTime().resize());
})

export { servicesScene };
