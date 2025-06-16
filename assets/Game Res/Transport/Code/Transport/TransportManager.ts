import { _decorator, Component } from 'cc';
import { Transport, TransportType, IslandLevel, IslandResource } from './TransportTypes';

const { ccclass, property } = _decorator;

@ccclass('TransportManager')
export class TransportManager extends Component {
    private transports: Map<TransportType, Transport> = new Map();
    private currentTransport: TransportType = TransportType.TURTLE;
    private islandLevel: IslandLevel = IslandLevel.LEVEL_1;
    private money: number = 1000;

    protected onLoad(): void {
        this.initializeTransports();
        this.initializeStartingResources();
    }

    private initializeTransports(): void {
        // Создаём транспортные средства с базовыми характеристиками
        this.transports.set(TransportType.TURTLE, new Transport(
            TransportType.TURTLE,
            70,  // базовая грузоподъёмность
            1.0  // скорость
        ));

        this.transports.set(TransportType.DOLPHIN, new Transport(
            TransportType.DOLPHIN,
            110,
            1.5
        ));

        this.transports.set(TransportType.ANGLER, new Transport(
            TransportType.ANGLER,
            150,
            1.2
        ));

        // Черепаха разблокирована по умолчанию
        this.transports.get(TransportType.TURTLE)?.unlock();
    }

    private initializeStartingResources(): void {
        // Здесь можно инициализировать ресурсы для первого уровня
    }

    public switchTransport(type: TransportType): boolean {
        const transport = this.transports.get(type);
        if (!transport || !transport.isUnlocked) return false;

        this.currentTransport = type;
        return true;
    }

    public unlockTransport(type: TransportType): boolean {
        const transport = this.transports.get(type);
        if (!transport || transport.isUnlocked) return false;

        const cost = this.getTransportUnlockCost(type);
        if (this.money >= cost) {
            this.money -= cost;
            transport.unlock();
            return true;
        }
        return false;
    }

    public getTransportUnlockCost(type: TransportType): number {
        // Можно сделать сложную логику расчёта стоимости
        switch (type) {
            case TransportType.DOLPHIN: return 5000;
            case TransportType.ANGLER: return 10000;
            default: return 0;
        }
    }

    public loadResource(resource: IslandResource, amount: number): boolean {
        const transport = this.transports.get(this.currentTransport);
        if (!transport) return false;

        return transport.loadResource(resource, amount);
    }

    public deliverResources(): number {
        const transport = this.transports.get(this.currentTransport);
        if (!transport) return 0;

        const profit = transport.unload();
        this.money += profit;
        return profit;
    }

    public upgradeIsland(): boolean {
        const nextLevel = this.islandLevel + 1;
        if (nextLevel > IslandLevel.LEVEL_3) return false;

        const cost = this.getIslandUpgradeCost(nextLevel);
        if (this.money >= cost) {
            this.money -= cost;
            this.islandLevel = nextLevel;
            return true;
        }
        return false;
    }

    private getIslandUpgradeCost(level: IslandLevel): number {
        switch (level) {
            case IslandLevel.LEVEL_2: return 15000;
            case IslandLevel.LEVEL_3: return 30000;
            default: return Infinity;
        }
    }

    public getCurrentTransportInfo() {
        const transport = this.transports.get(this.currentTransport);
        if (!transport) return null;

        return {
            type: this.currentTransport,
            ...transport.getLoadStatus(),
            speed: transport.speed
        };
    }

    public getMoney(): number {
        return this.money;
    }

    public getIslandLevel(): IslandLevel {
        return this.islandLevel;
    }
}