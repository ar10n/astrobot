import { Scenes } from 'telegraf';

export default interface CustomSession extends Scenes.SceneSession {
    name: string;
    email: string;
    currentService: number;
    msgId: number;
}