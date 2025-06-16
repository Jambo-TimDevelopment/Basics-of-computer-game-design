import { _decorator, Component, Node } from 'cc';
import { TransportManager } from './TransportManager';
import { TransportType, IslandResource, ResourceType, IslandLevel } from './TransportTypes';
const { ccclass, property } = _decorator;

@ccclass('TransportExample')
export class TransportExample extends Component {

    @property({ type: TransportManager })
    private transportManager: TransportManager | null = null;

    start() {
        // Пример работы с системой


        // Переключаемся на дельфина
        if (this.transportManager.switchTransport(TransportType.DOLPHIN)) {
            console.log("Now use dolphin");
        }

        // Загружаем ресурсы
        const resource: IslandResource = {
            type: ResourceType.WOOD,
            amount: 50,
            basePrice: 10,
            weight: 1,
            levelRequirement: IslandLevel.LEVEL_1
        };

        if (this.transportManager.loadResource(resource, 10)) {
            console.log("Load 10 woods");
        }

        // Доставляем ресурсы и получаем прибыль
        const profit = this.transportManager.deliverResources();
        console.log(`Earned: $${profit}`);

        // Улучшаем остров
        if (this.transportManager.upgradeIsland()) {
            console.log("Island upgraded!");
        }
    }

    update(deltaTime: number) {
        
    }
}

