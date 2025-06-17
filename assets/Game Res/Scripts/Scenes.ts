import { _decorator, Enum } from "cc";

// Создаем перечисление с именами наших сцен
export enum SceneName {
  // Значения должны совпадать с реальными именами файлов сцен
  Base = 0,
  Map = 1,
  Vehicle = 2,
}
// Регистрируем Enum, чтобы Cocos Creator мог его использовать в инспекторе
Enum(SceneName);
