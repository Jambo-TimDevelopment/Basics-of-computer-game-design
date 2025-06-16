import { TransportType, IslandResource, IslandLevel } from './TransportTypes';

export class Transport {
    private type: TransportType;
    private baseCapacity: number;
    private currentLoad: number = 0;
    private speed: number;
    private isUnlocked: boolean = false;

    constructor(type: TransportType, baseCapacity: number, speed: number) {
        this.type = type;
        this.baseCapacity = baseCapacity;
        this.speed = speed;
    }

    public unlock(): void {
        this.isUnlocked = true;
    }

    public calculateEffectiveCapacity(islandLevel: IslandLevel): number {
        // Грузоподъёмность увеличивается с уровнем острова
        return this.baseCapacity * islandLevel;
    }

    public canLoadResource(resource: IslandResource, islandLevel: IslandLevel): boolean {
        if (resource.levelRequirement > islandLevel) return false;

        const remainingCapacity = this.calculateEffectiveCapacity(islandLevel) - this.currentLoad;
        return remainingCapacity >= resource.weight;
    }

    public loadResource(resource: IslandResource, amount: number): boolean {
        const totalWeight = resource.weight * amount;
        if (totalWeight > (this.calculateEffectiveCapacity() - this.currentLoad)) {
            return false;
        }

        this.currentLoad += totalWeight;
        return true;
    }

    public unload(): number {
        const profit = this.calculateLoadProfit();
        this.currentLoad = 0;
        return profit;
    }

    private calculateLoadProfit(): number {
        // Здесь можно добавить сложную логику расчёта прибыли
        // Например, учитывать расстояние до острова, тип ресурсов и т.д.
        return this.currentLoad * 0.8; // Примерный коэффициент
    }

    public getLoadStatus(): { current: number; max: number } {
        return {
            current: this.currentLoad,
            max: this.calculateEffectiveCapacity()
        };
    }
}