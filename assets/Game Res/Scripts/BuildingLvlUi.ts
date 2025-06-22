import { _decorator, Component, director, Enum, Label } from "cc";
import { BaseScenesName } from "./Scenes";
import { BUILDING_LVL_UPDATED } from "./BuildingLvlUpdater";
const { ccclass, property } = _decorator;

const BUILDING_LVL_STORAGE_KEY = "building_lvl";

@ccclass("BuildingLvlUi")
export class BuildingLvlUi extends Component {
  @property({
    type: Enum(BaseScenesName),
    tooltip: "Scene to switch to",
  })
  buildingType: BaseScenesName = BaseScenesName.Garden;

  @property(Label)
  lvlLabel: Label = null;

  /**
   * updateLevel
   */
  public updateLevel(lvl: number): void {
    this.lvlLabel.string = `Lvl: ${lvl}`;
  }

  protected onEnable(): void {
    director.on(BUILDING_LVL_UPDATED, this.updateLevel, this);
  }

  protected onDisable(): void {
    director.off(BUILDING_LVL_UPDATED, this.updateLevel, this);
  }

  start() {
    this.updateLevel(1);
  }

  update(deltaTime: number) {}
}
