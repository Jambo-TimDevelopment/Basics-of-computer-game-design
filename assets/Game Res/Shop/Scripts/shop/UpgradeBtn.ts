import {_decorator, Component, Node, Sprite, SpriteFrame, resources, error, assetManager, Label, Color} from 'cc';
import {PlayerDataManager} from "db://assets/Game Res/Scripts/PlayerDataManager";
import {ShopLvlManager} from "./ShopLvlManager";

const {ccclass, property} = _decorator;

@ccclass('UpgradeBtn')
export class UpgradeBtn extends Component {
    @property(Label)
    public statusLabel: Label = null;

    start() {

    }

    update(deltaTime: number) {

    }

    onButtonClick() {
        this.setActive();
        this.setNeighbourInactive();
        this.setFontCurrent();
        this.setFontNeighbour();
        this.hideShop();
        this.showUpgrade();

        // Try to upgrade the shop
        // this.upgradeShop();
    }

    // private upgradeShop() {
    //     // Check if both managers are available
    //     if (!PlayerDataManager.instance || !ShopLvlManager.instance) {
    //         console.error("PlayerDataManager or ShopLvlManager not available");
    //         return;
    //     }
    //
    //     const playerBalance = PlayerDataManager.instance.getBalance();
    //     const upgradePrice = ShopLvlManager.instance.getUpgradePrice();
    //
    //     // Check if player has enough money
    //     if (playerBalance >= upgradePrice) {
    //         // Deduct the cost from player's balance
    //         PlayerDataManager.instance.setBalance(playerBalance - upgradePrice);
    //
    //         // Upgrade the shop
    //         ShopLvlManager.instance.upgradeShop();
    //
    //         if (this.statusLabel) {
    //             this.statusLabel.string = "Shop upgraded successfully!";
    //             this.statusLabel.color = new Color(0, 255, 0, 255); // Green
    //         }
    //
    //         console.log("Shop upgraded successfully!");
    //     } else {
    //         if (this.statusLabel) {
    //             this.statusLabel.string = "Not enough money for upgrade!";
    //             this.statusLabel.color = new Color(255, 0, 0, 255); // Red
    //         }
    //
    //         console.log("Not enough money for upgrade!");
    //     }
    // }

    private setFontNeighbour() {
        this.node.parent.children.filter(child => child.name == 'btn-sell' || child.name == 'btn-buy').forEach(child => {
            child.children.find(c => c.name == child.name.split('-')[1]).getComponent(Label).color = new Color("203D7E")
        });
    }

    private setFontCurrent() {
        this.node.children.find(child => child.name == 'upgrade').getComponent(Label).color = new Color("FFFFFF");
    }

    private setActive() {
        const uuidActive = "e65ba532-6c96-48c7-84ab-b87537bb3907@f9941";

        assetManager.loadAny({uuid: uuidActive}, (err, asset) => {
            if (err) {
                error(`Failed to load asset by UUID: ${uuidActive}`, err);
                return;
            }

            const sprite = this.node.getComponent(Sprite);
            if (sprite) {
                sprite.spriteFrame = asset;
            }
        })
    }

    private setNeighbourInactive() {
        const uuidInactive = "c74ce59d-1c73-41ee-af7f-65da34b2f0fb@f9941"

        assetManager.loadAny({uuid: uuidInactive}, (err, asset) => {
            if (err) {
                error(`Failed to load asset by UUID: ${uuidInactive}`, err);
                return;
            }

            this.node.parent.children.filter(child => child.name == 'btn-sell' || child.name == 'btn-buy')
                .forEach(child => {
                    const sprite = child.getComponent(Sprite)
                    if (sprite) {
                        sprite.spriteFrame = asset;
                    }
                });
        })
    }

    private hideShop() {
        this.node.parent.children.find(child => child.name == 'ScrollableShop').active = false;
    }

    private showUpgrade() {
        this.node.parent.parent.parent.children.find(child => child.name == 'ShopUpgrade').active = true;
    }
}
