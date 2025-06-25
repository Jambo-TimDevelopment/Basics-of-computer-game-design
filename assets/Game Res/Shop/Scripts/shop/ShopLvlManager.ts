import { _decorator, Component, director, Node, sys } from 'cc';
const { ccclass } = _decorator;

export interface ShopData {
  level: number;
}

// Key for localStorage
const SHOP_STORAGE_KEY = "shopData";

// Event names
export const EVENT_SHOP_LEVEL_UPDATED = "shop-level-updated";

export interface ShopLvl {
  lvl: number;
  capacity: number;
  upgradePrice: number;
  bonus: number; // Процентный бонус
}

// Карта уровней магазина
export const SHOP_LEVELS: Map<number, ShopLvl> = new Map([
  [1, { lvl: 1, capacity: 8, upgradePrice: 0, bonus: 0 }], // Разная для разных товаров
  [2, { lvl: 2, capacity: 12, upgradePrice: 1000, bonus: 10 }],
  [3, { lvl: 3, capacity: 16, upgradePrice: 2500, bonus: 10 }],
  [4, { lvl: 4, capacity: 20, upgradePrice: 5000, bonus: 15 }],
  [5, { lvl: 5, capacity: 24, upgradePrice: 10000, bonus: 20 }],
]);

@ccclass('ShopLvlManager')
export class ShopLvlManager extends Component {
  private data: ShopData = null;

  public static instance: ShopLvlManager = null;

  onLoad() {
    if (ShopLvlManager.instance === null) {
      ShopLvlManager.instance = this;
      director.addPersistRootNode(this.node);
    } else {
      // If instance already exists, destroy this duplicate
      this.node.destroy();
      return;
    }
    // Make this node persistent so it doesn't get destroyed when changing scenes
    this.load();
  }

  // --- Methods for working with data ---

  public getLevel(): number {
    return this.data.level;
  }

  /**
   * Changes the shop level, saves it and notifies subscribers
   */
  public setLevel(newLevel: number) {
    if (this.data.level === newLevel) return; // Do nothing if the value hasn't changed

    this.data.level = newLevel;
    console.log(`Shop level changed to: ${newLevel}`);

    // Update capacity and upgrade price based on new level

    this.save();

    // Notify the game that the shop level has changed
    director.emit(EVENT_SHOP_LEVEL_UPDATED, this.data.level);
  }

  /**
   * Upgrades the shop level by 1
   * @returns boolean indicating if upgrade was successful
   */
  public upgradeShop(): boolean {
    // Here you would typically check if player has enough money
    // For now, just increment the level
    this.setLevel(this.data.level + 1);
    return true;
  }

  // --- Loading and saving ---

  private load() {
    const dataString = sys.localStorage.getItem(SHOP_STORAGE_KEY);
    if (dataString) {
      this.data = JSON.parse(dataString);
      console.log("Shop data loaded:", this.data);
    } else {
      // If no data, create defaults
      console.log("Shop data not found. Creating defaults.");
      this.data = {
        level: 1,
      };

      this.save();
      director.emit(EVENT_SHOP_LEVEL_UPDATED, this.data.level);
    }
  }

  private save() {
    sys.localStorage.setItem(SHOP_STORAGE_KEY, JSON.stringify(this.data));
  }
}
