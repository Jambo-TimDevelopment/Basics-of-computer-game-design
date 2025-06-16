import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('TransportExample')
export class TransportExample extends Component {
    start() {
        // Пример работы с системой

        // Получаем менеджер транспорта
        const transportManager = this.node.getComponent(TransportManager);

        // Переключаемся на дельфина
        if (transportManager.switchTransport(TransportType.DOLPHIN)) {
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

        if (transportManager.loadResource(resource, 10)) {
            console.log("Load 10 woods");
        }

        // Доставляем ресурсы и получаем прибыль
        const profit = transportManager.deliverResources();
        console.log(`Earned: $${profit}`);

        // Улучшаем остров
        if (transportManager.upgradeIsland()) {
            console.log("Island upgraded!");
        }
    }

    update(deltaTime: number) {
        
    }
}

