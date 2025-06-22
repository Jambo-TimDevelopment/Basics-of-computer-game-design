import { _decorator, Component, director, Node } from "cc";
import { BaseScenesName } from "./Scenes";
const { ccclass, property } = _decorator;

export const BUILDING_LVL_UPDATED = "";

type BuildingLvls = {
  [key in BaseScenesName]: number;
};

@ccclass("BuildingLvlUpdater")
export class BuildingLvlUpdater extends Component {
  private _buildingLvls: BuildingLvls = {
    [BaseScenesName.Garden]: 1,
    [BaseScenesName.Merchant]: 1,
    [BaseScenesName.Warehouse]: 1,
    [BaseScenesName.Workshop]: 1,
  };

  start() {}

  /**
   * updateBuildingLvl
   */
  public updateBuildingLvl(buildingType: BaseScenesName, lvl: number) {
    this._buildingLvls[buildingType] = lvl;
    director.emit(BUILDING_LVL_UPDATED, buildingType, lvl);
  }

  update(deltaTime: number) {}
}
