import { _decorator, Component, director, Enum, Node } from "cc";
import { BaseScenesName } from "./Scenes";
const { ccclass, property } = _decorator;

@ccclass("MainBaseSceneSwitcher")
export class MainBaseSceneSwitcher extends Component {
  @property({
    type: Enum(BaseScenesName),
    tooltip: "Scene to switch to",
  })
  public targetScene: BaseScenesName = BaseScenesName.Warehouse;

  public changeScene() {
    // Получаем строковое имя из Enum
    const sceneStringName = BaseScenesName[this.targetScene];

    if (!sceneStringName) {
      console.error("Выбрана некорректная сцена!");
      return;
    }

    director.loadScene(sceneStringName);
  }
}
