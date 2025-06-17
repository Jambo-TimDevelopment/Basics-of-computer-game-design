import { _decorator, Component, director, Enum } from "cc";
import { SceneName } from "./Scenes";
const { ccclass, property } = _decorator;

@ccclass("SceneSwitcher")
export class SceneSwitcher extends Component {
  @property({
    type: Enum(SceneName), // Теперь тип свойства - это наш Enum
    tooltip: "Выберите сцену для загрузки из списка",
  })
  public targetScene: SceneName = SceneName.Base; // Значение по умолчанию

  public changeScene() {
    // Получаем строковое имя из Enum
    const sceneStringName = SceneName[this.targetScene];

    if (!sceneStringName) {
      console.error("Выбрана некорректная сцена!");
      return;
    }

    director.loadScene(sceneStringName);
  }
}
