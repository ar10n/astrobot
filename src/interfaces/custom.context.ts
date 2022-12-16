import { Context, Scenes } from 'telegraf';
import CustomSession from './custom.session';

export default interface CustomContext extends Context {
    session: CustomSession;
    scene: Scenes.SceneContextScene<CustomContext>;
}