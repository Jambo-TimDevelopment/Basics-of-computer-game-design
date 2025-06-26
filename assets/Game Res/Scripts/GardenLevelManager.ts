import { _decorator, director, Component, sys } from "cc";
const { ccclass } = _decorator;

export interface GardenData {
    level: number;
    unlockedCells: number;
}

const GARDEN_STORAGE_KEY = "gardenData";
export const EVENT_GARDEN_LEVEL_UPDATED = "garden-level-updated";
import { PlayerDataManager} from './PlayerDataManager';

export interface GardenLevelConfig {
    level: number;
    unlockedCells: number;
    upgradeCost: number;
}

export const GARDEN_LEVELS: Map<number, GardenLevelConfig> = new Map([
    [1, { level: 1, unlockedCells: 2, upgradeCost: 500 }],  // 2 строки (3x2)
    [2, { level: 2, unlockedCells: 3, upgradeCost: 200 }], // +1 строка
    [3, { level: 3, unlockedCells: 4, upgradeCost: 100 }],
    [4, { level: 4, unlockedCells: 5, upgradeCost: 100 }],
    [5, { level: 5, unlockedCells: 6, upgradeCost: 10 }],
    [6, { level: 6, unlockedCells: 7, upgradeCost: 10 }],
    [7, { level: 7, unlockedCells: 8, upgradeCost: 32000 }],
    [8, { level: 8, unlockedCells: 9, upgradeCost: 64000 }],
    [9, { level: 9, unlockedCells: 10, upgradeCost: 128000 }], // Все ячейки
]);

@ccclass("GardenLevelManager")
export class GardenLevelManager extends Component {
    private data: GardenData = null;
    public static instance: GardenLevelManager = null;

    onLoad() {
        if (GardenLevelManager.instance === null) {
            GardenLevelManager.instance = this;
            director.addPersistRootNode(this.node);
            this.load();
        } else {
            this.node.destroy();
        }
    }

    public getCurrentLevel(): GardenLevelConfig {
        const level = this.data.level;
        return GARDEN_LEVELS.get(level) || GARDEN_LEVELS.get(1)!;
    }

    public getNextLevel(): GardenLevelConfig | null {
        const nextLevel = this.data.level + 1;
        return GARDEN_LEVELS.get(nextLevel) || null;
    }

    public upgrade(): boolean {
        const nextLevel = this.getNextLevel();
        if (!nextLevel) return false;

        const playerBalance = PlayerDataManager.instance.getBalance();
        const upgradePrice = nextLevel.upgradeCost;

        // Check if player has enough money
        if (playerBalance >= upgradePrice) {
            // Deduct the cost from player's balance
            PlayerDataManager.instance.setBalance(playerBalance - upgradePrice);
            this.data.level = nextLevel.level;
            this.data.unlockedCells = nextLevel.unlockedCells;
            this.save();
            director.emit(EVENT_GARDEN_LEVEL_UPDATED, this.data);
            return true;
        }
        return false;
    }

    private load() {
        const dataString = sys.localStorage.getItem(GARDEN_STORAGE_KEY);
        if (dataString) {
            this.data = JSON.parse(dataString);
        } else {
            this.data = {
                level: 1,
                unlockedCells: 6
            };
            this.save();
        }
    }

    private save() {
        sys.localStorage.setItem(GARDEN_STORAGE_KEY, JSON.stringify(this.data));
    }
}