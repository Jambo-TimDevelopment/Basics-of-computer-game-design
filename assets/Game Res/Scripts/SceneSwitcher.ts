import { _decorator, Component, director, Enum } from "cc";
import { GameSceneName } from "./Scenes";
const { ccclass, property } = _decorator;

@ccclass("SceneSwitcher")
export class SceneSwitcher extends Component {
  @property({
    type: Enum(GameSceneName), // Теперь тип свойства - это наш Enum
    tooltip: "Выберите сцену для загрузки из списка",
  })
  public targetScene: GameSceneName = GameSceneName.Base; // Значение по умолчанию

  public changeScene() {
    // Получаем строковое имя из Enum
    const sceneStringName = GameSceneName[this.targetScene];

    if (!sceneStringName) {
      console.error("Выбрана некорректная сцена!");
      return;
    }

    director.loadScene(sceneStringName);
  }
}
