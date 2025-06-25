import { _decorator, Component, Node, Label, Color } from 'cc';
import { PlayerDataManager } from "db://assets/Game Res/Scripts/PlayerDataManager";
import { ShopLvlManager, SHOP_LEVELS } from './ShopLvlManager';
import { ScrollableShop } from './ScrollableShop';
const { ccclass, property } = _decorator;

@ccclass('DoUpgradeBtn')
export class DoUpgradeBtn extends Component {
    @property(Label)
    public statusLabel: Label = null;

    @property(ScrollableShop)
    public scrollableShop: ScrollableShop = null;

    start() {
        // Initialize if needed
    }

    update(deltaTime: number) {
        // Update logic if needed
    }

    onButtonClick() {
        this.upgradeShop();
    }

    private upgradeShop() {
        // Check if both managers are available
        if (!PlayerDataManager.instance || !ShopLvlManager.instance) {
            console.error("PlayerDataManager or ShopLvlManager not available");
            return;
        }

        const currentLevel = ShopLvlManager.instance.getLevel();
        const nextLevel = currentLevel + 1;
        const nextLevelData = SHOP_LEVELS.get(nextLevel);

        // Check if next level exists
        if (!nextLevelData) {
            if (this.statusLabel) {
                this.statusLabel.string = "Максимальный уровень достигнут!";
                this.statusLabel.color = new Color(255, 165, 0, 255); // Orange
            }
            console.log("Maximum level reached!");
            return;
        }

        const playerBalance = PlayerDataManager.instance.getBalance();
        const upgradePrice = nextLevelData.upgradePrice;

        // Check if player has enough money
        if (playerBalance >= upgradePrice) {
            // Deduct the cost from player's balance
            PlayerDataManager.instance.setBalance(playerBalance - upgradePrice);

            // Upgrade the shop
            ShopLvlManager.instance.upgradeShop();

            // Reset default items in the shop to match the new capacity
            if (this.scrollableShop) {
                this.scrollableShop.resetDefaultItems();
                console.log("Reset default items after shop upgrade");
            } else {
                console.warn("ScrollableShop reference not set, cannot reset default items");
            }

            if (this.statusLabel) {
                this.statusLabel.string = "Магазин успешно улучшен!";
                this.statusLabel.color = new Color(0, 255, 0, 255); // Green
            }

            console.log("Shop upgraded successfully!");
        } else {
            if (this.statusLabel) {
                this.statusLabel.string = "Недостаточно денег для улучшения!";
                this.statusLabel.color = new Color(255, 0, 0, 255); // Red
            }

            console.log("Not enough money for upgrade!");
        }
    }
}
