import { categoriesScene } from './categories.scene';
import { servicesScene } from './services.scene';
import { payableServiceDetailsScene } from './payableService.details.scene';
import { categoryDetailsScene } from './category.details.scene';
import { cartScene } from './cart/cart.scene';
import { buyScene } from './cart/buy.scene';
import { contactsScene } from './cart/contacts.scene';
import { nameScene } from './cart/name.scene';

export const allScenes = [
    contactsScene,
    nameScene,
    buyScene,
    cartScene,
    categoriesScene,
    servicesScene,
    categoryDetailsScene,
    payableServiceDetailsScene
];