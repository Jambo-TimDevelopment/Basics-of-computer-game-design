import {_decorator, Component, Node, Sprite, SpriteFrame, resources, error, assetManager, Label, Color} from 'cc';
import { ScrollableShop, ShopMode } from './ScrollableShop';

const {ccclass, property} = _decorator;

@ccclass('BuyBtn')
export class BuyBtn extends Component {
    start() {

    }

    update(deltaTime: number) {

    }

    onButtonClick() {
        this.setActive();
        this.setNeighbourInactive();
        this.setFontCurrent();
        this.setFontNeighbour();
        this.showShop();
        this.hideUpgrade();
        this.resetShopToDefaultItems();
    }

    private resetShopToDefaultItems() {
        // Get the ScrollableShop component
        const scrollableShopNode = this.node.parent.children.find(child => child.name === 'ScrollableShop');
        if (!scrollableShopNode) {
            console.error('ScrollableShop node not found');
            return;
        }

        const scrollableShop = scrollableShopNode.getComponent(ScrollableShop);
        if (!scrollableShop) {
            console.error('ScrollableShop component not found');
            return;
        }

        // Set shop mode to BUY
        scrollableShop.setMode(ShopMode.BUY);

        // Reset to default items
        scrollableShop.resetDefaultItems();

        // Refresh the shop to display the default items
        scrollableShop.refreshShop();
    }

    private setFontNeighbour() {
        this.node.parent.children.filter(child => child.name == 'btn-sell' || child.name == 'btn-upgrade').forEach(child => {
            child.children.find(c => c.name == child.name.split('-')[1]).getComponent(Label).color = new Color("203D7E")
        });
    }

    private setFontCurrent() {
        this.node.children.find(child => child.name == 'buy').getComponent(Label).color = new Color("FFFFFF");
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

            this.node.parent.children.filter(child => child.name == 'btn-sell' || child.name == 'btn-upgrade')
                .forEach(child => {
                    const sprite = child.getComponent(Sprite)
                    if (sprite) {
                        sprite.spriteFrame = asset;
                    }
                });
        })
    }

    private showShop() {
        this.node.parent.children.find(child => child.name == 'ScrollableShop').active = true;
    }

    private hideUpgrade() {
        this.node.parent.parent.parent.children.find(child => child.name == 'ShopUpgrade').active = false;
    }
}
