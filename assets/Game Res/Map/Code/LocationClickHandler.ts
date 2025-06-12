import { _decorator, Component, Node, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('LocationClickHandler')
export class LocationClickHandler extends Component {
    // Карта соответствия имени ноды и сцены
    private locationSceneMap: Record<string, string> = {
        "IceLandsBtn": "ice-lands",
        "SwampsBtn": "swamps",
        "TropicalLandsBtn": "tropical-lands",
        "UnderWaterLandsBtn": "underwater-lands",
    };

    start() {
        this.node.on(Node.EventType.TOUCH_END, this.onLocationClick, this);
    }

    onLocationClick() {
        const nodeName = this.node.name; // Получаем имя текущей ноды (например, "IcelandsBtn")
        const targetScene = this.locationSceneMap[nodeName]; // Находим соответствующую сцену
        if (targetScene) {
            director.loadScene(targetScene);
        } else {
            console.error(`No scene mapped for node: ${nodeName}`);
        }
    }

    onDestroy() {
        this.node.off(Node.EventType.TOUCH_END, this.onLocationClick, this);
    }
}