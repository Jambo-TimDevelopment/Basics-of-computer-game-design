import { _decorator, Component, Node, Label, director } from 'cc';
import {
  EVENT_SHOP_LEVEL_UPDATED,
  ShopLvlManager,
  SHOP_LEVELS
} from './ShopLvlManager';
const { ccclass, property } = _decorator;

@ccclass('ShopLvlUiUpdater')
export class ShopLvlUiUpdater extends Component {
    @property(Label)
    public levelLabel: Label = null;

    @property(Label)
    public upgradeLevelLabel: Label = null;

    @property(Label)
    public capacityImprovementLabel: Label = null;

    @property(Label)
    public upgradePriceLabel: Label = null;

    @property(Node)
    public disableOnMaxLevelElement: Node = null;

    onEnable() {
        // Subscribe to events when the component becomes active
        director.on(EVENT_SHOP_LEVEL_UPDATED, this.updateLevel, this);

        // Initialize UI with current values
        this.initializeUI();
    }

    onDisable() {
        // Unsubscribe from events when the component becomes inactive
        director.off(EVENT_SHOP_LEVEL_UPDATED, this.updateLevel, this);
    }

    /**
     * This method will be called by the EVENT_SHOP_LEVEL_UPDATED event
     * @param newLevel New shop level value passed with the event
     */
    private updateLevel(newLevel: number) {
        if (this.levelLabel) {
            this.levelLabel.string = `Ур. ${newLevel}`;
            console.log("Updated shop level UI:", newLevel);
        }

        // Update upgrade information
        this.updateUpgradeInfo(newLevel);
    }

    /**
     * Updates the UI elements related to shop upgrade
     * @param currentLevel Current shop level
     */
    private updateUpgradeInfo(currentLevel: number) {
        const currentLevelData = SHOP_LEVELS.get(currentLevel);
        const nextLevel = currentLevel + 1;
        const nextLevelData = SHOP_LEVELS.get(nextLevel);

        if (!nextLevelData) {
            // Hide upgrade info if max level reached
            this.hideUpgradeInfo();
            return;
        }

        // Update upgrade level label
        if (this.upgradeLevelLabel) {
            this.upgradeLevelLabel.string = `Улучшить до уровня ${nextLevel}:`;
        }

        // Update capacity improvement label
        if (this.capacityImprovementLabel) {
            const capacityIncrease = nextLevelData.capacity - currentLevelData.capacity;
            this.capacityImprovementLabel.string = `+${capacityIncrease} ячеек (${nextLevelData.capacity} всего)`;
        }

        // Update upgrade price label
        if (this.upgradePriceLabel) {
            this.upgradePriceLabel.string = `${nextLevelData.upgradePrice}`;
        }

        // Enable the element when not at max level
        if (this.disableOnMaxLevelElement) {
            this.disableOnMaxLevelElement.active = true;
        }
    }

    /**
     * Updates upgrade information when max level is reached
     */
    private hideUpgradeInfo() {
        if (this.upgradeLevelLabel) {
            this.upgradeLevelLabel.string = 'Максимальный уровень достигнут!';
        }

        if (this.capacityImprovementLabel) {
            this.capacityImprovementLabel.string = '';
        }

        if (this.upgradePriceLabel) {
            this.upgradePriceLabel.string = '';
        }

        // Disable the element when max level is reached
        if (this.disableOnMaxLevelElement) {
            this.disableOnMaxLevelElement.active = false;
        }
    }

    private initializeUI() {
        // Check if ShopLvlManager is already loaded
        if (ShopLvlManager.instance) {
            const currentLevel = ShopLvlManager.instance.getLevel();
            this.updateLevel(currentLevel);
        }
    }
}
