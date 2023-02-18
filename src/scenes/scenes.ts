import { categoriesScene } from './categories.scene';
import { cityScene } from './registration/city.scene';
import { nameScene } from './registration/name.scene';
import { servicesScene } from './services.scene';
import { serviceDetailsScene } from './service.details.scene';
import { changeUserDataScene } from './changeUserData/changeUserData.scene';
import { changeNameScene } from './changeUserData/changeName.scene';
import { changeCityScene } from './changeUserData/changeCity.scene';
import { cartScene } from './cart/cart.scene';

export const allScenes = [
    cartScene,
    categoriesScene,
    changeCityScene,
    changeNameScene,
    changeUserDataScene,
    cityScene,
    nameScene,
    servicesScene,
    serviceDetailsScene
];