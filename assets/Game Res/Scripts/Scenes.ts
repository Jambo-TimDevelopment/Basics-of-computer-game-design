import { _decorator, Enum } from "cc";

// Создаем перечисление с именами наших сцен
export enum GameSceneName {
  // Значения должны совпадать с реальными именами файлов сцен
  Base = 0,
  Map = 1,
  Vehicle = 2,
}
// Регистрируем Enum, чтобы Cocos Creator мог его использовать в инспекторе
Enum(GameSceneName);

export enum BaseScenesName {
  Merchant = "merchant",
  Workshop = "workshop",
  Garden = "garden",
  Warehouse = "warehouse",
}

Enum(BaseScenesName);
