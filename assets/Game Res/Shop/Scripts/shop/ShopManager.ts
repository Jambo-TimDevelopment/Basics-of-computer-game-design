import { _decorator, Component, Node } from 'cc';
import { ScrollableShop } from './ScrollableShop';

const { ccclass, property } = _decorator;

/**
 * Sample shop manager that demonstrates how to use the ScrollableShop component
 */
@ccclass('ShopManager')
export class ShopManager extends Component {
    @property(Node)
    public shopNode: Node = null;

    private _scrollableShop: ScrollableShop = null;

    start() {
        // Get reference to the ScrollableShop component
        this._scrollableShop = this.shopNode?.getComponent(ScrollableShop);

        if (!this._scrollableShop) {
            console.error('ScrollableShop component not found on shopNode');
            return;
        }

        // Initialize the shop with lotos seeds and related items
        this.initializeShop();

        // Listen for item selection events
        this._scrollableShop.node.on('item-selected', this.onItemSelected, this);
    }

    onDestroy() {
        // Clean up event listener when component is destroyed
        if (this._scrollableShop) {
            this._scrollableShop.node.off('item-selected', this.onItemSelected, this);
        }
    }

    /**
     * Initialize the shop with dummy items including lotos seeds
     */
    private initializeShop(): void {
        // Dummy shop items with lotos seeds and related items
        const shopItems = [
            { id: '001', name: 'Lotos Seeds', price: 50, description: 'Seeds from the sacred lotos flower' },
            { id: '002', name: 'Blue Lotos', price: 120, description: 'Rare blue lotos flower' },
            { id: '003', name: 'Red Lotos', price: 100, description: 'Vibrant red lotos flower' },
            { id: '004', name: 'Lotos Root', price: 30, description: 'Medicinal lotos root' },
            { id: '005', name: 'Lotos Elixir', price: 200, description: 'Powerful healing elixir made from lotos' },
            { id: '006', name: 'Lotos Incense', price: 75, description: 'Fragrant incense made from dried lotos' },
            { id: '007', name: 'Lotos Tea', price: 45, description: 'Calming tea made from lotos petals' },
            { id: '008', name: 'Lotos Charm', price: 150, description: 'Protective charm made from lotos seeds' }
        ];

        // Set all items at once
        this._scrollableShop.setItems(shopItems);
    }

    /**
     * Handle item selection
     * @param item The selected shop item
     */
    private onItemSelected(item: any): void {
        console.log(`Selected item: ${item.name} (${item.id}) - Price: ${item.price}`);

        // Here you can implement your own logic for handling item selection
        // For example:
        // - Check if player has enough money
        // - Add item to inventory
        // - Show item details
        // - etc.
    }

    /**
     * Public method to add a new lotos-themed item to the shop
     * This can be called from other scripts or UI buttons
     */
    public addNewItem(): void {
        // Lotos item types for random generation
        const lotosTypes = [
            { prefix: 'Lotos Seeds', descPrefix: 'Seeds from the sacred' },
            { prefix: 'Blue Lotos', descPrefix: 'Rare blue' },
            { prefix: 'Red Lotos', descPrefix: 'Vibrant red' },
            { prefix: 'White Lotos', descPrefix: 'Pure white' },
            { prefix: 'Lotos Root', descPrefix: 'Medicinal' },
            { prefix: 'Lotos Elixir', descPrefix: 'Powerful' },
            { prefix: 'Lotos Incense', descPrefix: 'Fragrant' },
            { prefix: 'Lotos Tea', descPrefix: 'Calming' },
            { prefix: 'Lotos Charm', descPrefix: 'Protective' },
            { prefix: 'Lotos Extract', descPrefix: 'Concentrated' }
        ];

        // Select a random lotos type
        const typeIndex = Math.floor(Math.random() * lotosTypes.length);
        const type = lotosTypes[typeIndex];

        // Generate a random ID
        const randomId = Math.floor(Math.random() * 1000);

        const newItem = {
            id: `00${randomId}`,
            name: `${type.prefix}`,
            price: Math.floor(Math.random() * 200) + 30,
            description: `${type.descPrefix} lotos flower`
        };

        this._scrollableShop.addItem(newItem);
    }

    /**
     * Public method to clear all items from the shop
     * This can be called from other scripts or UI buttons
     */
    public clearShop(): void {
        this._scrollableShop.clearItems();
    }

    /**
     * Public method to refresh the shop with new lotos-themed items
     * This can be called from other scripts or UI buttons
     */
    public refreshShop(): void {
        // Generate new random lotos-themed items
        const itemCount = Math.floor(Math.random() * 8) + 2; // 2-10 items
        const shopItems = [];

        // Lotos item types for random generation
        const lotosTypes = [
            { prefix: 'Lotos Seeds', descPrefix: 'Seeds from' },
            { prefix: 'Blue Lotos', descPrefix: 'Rare blue' },
            { prefix: 'Red Lotos', descPrefix: 'Vibrant red' },
            { prefix: 'White Lotos', descPrefix: 'Pure white' },
            { prefix: 'Lotos Root', descPrefix: 'Medicinal' },
            { prefix: 'Lotos Elixir', descPrefix: 'Powerful' },
            { prefix: 'Lotos Incense', descPrefix: 'Fragrant' },
            { prefix: 'Lotos Tea', descPrefix: 'Calming' },
            { prefix: 'Lotos Charm', descPrefix: 'Protective' },
            { prefix: 'Lotos Extract', descPrefix: 'Concentrated' }
        ];

        for (let i = 0; i < itemCount; i++) {
            // Select a random lotos type
            const typeIndex = Math.floor(Math.random() * lotosTypes.length);
            const type = lotosTypes[typeIndex];

            // Generate a quality suffix for variety
            const qualities = ['Common', 'Rare', 'Exotic', 'Premium', 'Wild', 'Cultivated'];
            const quality = qualities[Math.floor(Math.random() * qualities.length)];

            shopItems.push({
                id: `00${i + 1}`,
                name: `${type.prefix} (${quality})`,
                price: Math.floor(Math.random() * 200) + 30,
                description: `${type.descPrefix} ${quality.toLowerCase()} lotos flower`
            });
        }

        this._scrollableShop.setItems(shopItems);
    }
}
