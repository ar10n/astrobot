// Сцены общего функционала
import { categoriesScene } from './categories.scene';
import { servicesScene } from './services.scene';
import { payableServiceDetailsScene } from './payableService.details.scene';
import { categoryDetailsScene } from './category.details.scene';
import { cartScene } from './cart/cart.scene';
import { buyScene } from './cart/buy.scene';
import { contactsScene } from './cart/contacts.scene';
import { nameScene } from './cart/name.scene';

// Сцены астротеста
import { startTestScene } from './astrotest/startTest.scene';
import { onceOrManyQuestScene } from './astrotest/onceOrManyQuest.scene';
import { astroPredictionQuestScene } from './astrotest/astroPredictionQuest.scene';
import { astroPredictionPeriodQuestScene } from './astrotest/astroPredictionPeriodQuest.scene';
import { onlineQuestScene } from './astrotest/onlineQuest.scene';
import { starCardQuestScene } from './astrotest/starCardQuest.scene';
import { selfRealizationQuestScene } from './astrotest/selfRealizationQuest.scene';
import { financeQuestScene } from './astrotest/financeQuest.scene';
import { personalLifeQuestScene } from './astrotest/personalLifeQuest.scene';
import { destinyQuestScene } from './astrotest/destinyQuest.scene';
import {relocationQuestScene} from './astrotest/relocationQuest.scene';

export const allScenes = [
    contactsScene,
    nameScene,
    buyScene,
    cartScene,
    categoriesScene,
    servicesScene,
    categoryDetailsScene,
    payableServiceDetailsScene,
    startTestScene,
    onceOrManyQuestScene,
    astroPredictionQuestScene,
    astroPredictionPeriodQuestScene,
    onlineQuestScene,
    starCardQuestScene,
    selfRealizationQuestScene,
    financeQuestScene,
    personalLifeQuestScene,
    destinyQuestScene,
    relocationQuestScene
];