import { Context, Scenes } from 'telegraf';

interface CustomSession extends Scenes.SceneSession {
    name: string;
    id: number;
    categoryId: number;
    serviceId: number;
}

interface CustomContext extends Context {
    session: CustomSession;
    scene: Scenes.SceneContextScene<CustomContext>;
}

export default CustomContext;