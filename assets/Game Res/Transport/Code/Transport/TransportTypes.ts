export enum TransportType {
    TURTLE = 'turtle',
    DOLPHIN = 'dolphin',
    ANGLER = 'angler'
}

export enum IslandLevel {
    LEVEL_1 = 1,
    LEVEL_2 = 2,
    LEVEL_3 = 3
}

export interface Transport {
    type: TransportType;
    baseCapacity: number;
    speed: number;
    unlockCost: number;
}

export interface IslandResource {
    type: ResourceType;
    amount: number;
    basePrice: number;
    weight: number;
    levelRequirement: IslandLevel;
}

export enum ResourceType {
    WOOD = 'wood',
    STONE = 'stone',
    FOOD = 'food',
    GOLD_ORE = 'gold_ore',
    CORAL = 'coral'
}