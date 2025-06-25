import { _decorator, Component, Node, Prefab, instantiate, UITransform, Vec3, Button, Label, sys } from 'cc';
import { ShopLvlManager, SHOP_LEVELS } from './ShopLvlManager';
import { PlayerDataManager } from '../../../Scripts/PlayerDataManager';
import { ItemData } from '../../../Scripts/ItemController';
const { ccclass, property } = _decorator;

// Key for inventory data storage
const USER_DATA_KEY = "userData";

/**
 * Enum for shop modes
 */
export enum ShopMode {
    BUY = 'buy',
    SELL = 'sell'
}

interface ShopItem {
    id: string;
    name: string;
    price?: number;
    description?: string;
    // Add other properties as needed
}

@ccclass('ScrollableShop')
export class ScrollableShop extends Component {
    @property(Prefab)
    public buttonPrefab: Prefab = null;

    @property(Prefab)
    public navigationButtonPrefab: Prefab = null;

    @property
    public columnCount: number = 2;

    @property
    public spacing: number = 21;

    @property
    public paddingTop: number = 10;

    @property
    public paddingLeft: number = 10;

    @property
    public paddingRight: number = 10;

    @property
    public paddingBottom: number = 10;

    private _items: ShopItem[] = [];
    private _buttonNodes: Node[] = [];
    private _navigationButtons: Node[] = [];
    private _currentPage: number = 0;
    private _itemsPerPage: number = 6;
    private _currentMode: ShopMode = ShopMode.BUY;

    // Store positioning values for consistent button layout
    private _leftX: number = -82.25;
    private _rightX: number = 82.25;
    private _topY: number = 145;
    private _bottomY: number = -140;
    private _verticalStep: number = 95;

    private _defaultItems: ShopItem[] = [
        { id: '4001', name: 'Lotos Seeds', price: 50, description: 'Seeds from the sacred lotos flower' },
        { id: '4002', name: 'Blue Lotos', price: 120, description: 'Rare blue lotos flower' },
        { id: '4003', name: 'Red Lotos', price: 100, description: 'Vibrant red lotos flower' },
        { id: '4004', name: 'Lotos Root', price: 30, description: 'Medicinal lotos root' },
        { id: '4005', name: 'White Lotos', price: 150, description: 'Pure white lotos flower' },
        { id: '4006', name: 'Lotos Petals', price: 25, description: 'Fragrant lotos petals' },
        { id: '4007', name: 'Lotos Extract', price: 200, description: 'Concentrated lotos extract' },
        { id: '4008', name: 'Lotos Incense', price: 75, description: 'Aromatic lotos incense' },
        { id: '4009', name: 'Lotos Powder', price: 90, description: 'Fine lotos powder for rituals' },
        { id: '4010', name: 'Lotos Elixir', price: 250, description: 'Powerful healing elixir made from lotos' },
        { id: '4011', name: 'Lotos Amulet', price: 180, description: 'Protective amulet with dried lotos' },
        { id: '4012', name: 'Lotos Scroll', price: 120, description: 'Ancient scroll with lotos teachings' },
        { id: '4013', name: 'Lotos Tea', price: 60, description: 'Calming tea made from lotos leaves' },
        { id: '4014', name: 'Lotos Candle', price: 45, description: 'Scented candle with lotos essence' },
        { id: '4015', name: 'Lotos Oil', price: 110, description: 'Therapeutic oil extracted from lotos' },
        { id: '4016', name: 'Lotos Charm', price: 95, description: 'Lucky charm made with dried lotos' },
        { id: '4017', name: 'Lotos Ink', price: 85, description: 'Special ink made from lotos pigments' },
        { id: '4018', name: 'Lotos Soap', price: 40, description: 'Cleansing soap with lotos extracts' },
        { id: '4019', name: 'Lotos Mask', price: 130, description: 'Facial mask with lotos healing properties' },
        { id: '4020', name: 'Lotos Tonic', price: 160, description: 'Rejuvenating tonic with lotos essence' },
        { id: '4021', name: 'Lotos Crystal', price: 220, description: 'Crystal infused with lotos energy' },
        { id: '4022', name: 'Lotos Perfume', price: 175, description: 'Elegant perfume with lotos scent' },
        { id: '4023', name: 'Lotos Bracelet', price: 140, description: 'Woven bracelet with lotos motifs' },
        { id: '4024', name: 'Lotos Remedy', price: 190, description: 'Traditional remedy made from lotos' }
    ];

    start() {
        this._defaultItems.sort((a, b) => a.price - b.price);

        // Add some default items if the array is empty
        if (this._items.length === 0) {
            this.resetDefaultItems();
            console.log('Added default items to ScrollableShop');
        }

        // Add event listeners for item purchase and sale
        this.node.on('item-selected', this.handleItemPurchase, this);
        this.node.on('item-sold', this.handleItemSale, this);

        // Refresh the shop display
        this.refreshShop();
    }

    /**
     * Handle item purchase
     * @param item The item to purchase
     */
    private handleItemPurchase(item: ShopItem): void {
        console.log(`Handling purchase of item: ${item.name} (${item.id}) for ${item.price}`);

        // Check if PlayerDataManager is available
        if (!PlayerDataManager.instance) {
            console.error('PlayerDataManager not available');
            return;
        }

        // Get player's current balance
        const playerBalance = PlayerDataManager.instance.getBalance();

        // Check if player has enough money
        if (playerBalance < item.price) {
            console.log(`Not enough money to buy ${item.name}. Balance: ${playerBalance}, Price: ${item.price}`);
            return;
        }

        // Update player's balance
        PlayerDataManager.instance.setBalance(playerBalance - item.price);
        console.log(`Updated player balance: ${playerBalance} - ${item.price} = ${playerBalance - item.price}`);

        // Add item to inventory
        this.addItemToInventory(item);
    }

    /**
     * Handle item sale
     * @param item The item to sell
     */
    private handleItemSale(item: ShopItem): void {
        console.log(`Handling sale of item: ${item.name} (${item.id}) for ${item.price}`);

        // Check if PlayerDataManager is available
        if (!PlayerDataManager.instance) {
            console.error('PlayerDataManager not available');
            return;
        }

        // Get player's current balance
        const playerBalance = PlayerDataManager.instance.getBalance();

        // Update player's balance
        PlayerDataManager.instance.setBalance(playerBalance + item.price);
        console.log(`Updated player balance: ${playerBalance} + ${item.price} = ${playerBalance + item.price}`);

        // Remove item from inventory
        this.removeItemFromInventory(item);
    }

    /**
     * Add item to inventory
     * @param item The item to add to inventory
     */
    private addItemToInventory(item: ShopItem): void {
        // Get current inventory
        const dataString = sys.localStorage.getItem(USER_DATA_KEY);
        let inventoryItems: ItemData[] = [];

        if (dataString) {
            try {
                inventoryItems = JSON.parse(dataString);
            } catch (e) {
                console.error('Failed to parse inventory data:', e);
                return;
            }
        }

        // Check if item already exists in inventory
        const existingItemIndex = inventoryItems.findIndex(i => i.itemName === item.name);

        if (existingItemIndex !== -1) {
            // Increment count if item already exists
            inventoryItems[existingItemIndex].count += 1;
            console.log(`Incremented count of ${item.name} in inventory to ${inventoryItems[existingItemIndex].count}`);
        } else {
            // Add new item to inventory
            const newItem: ItemData = {
                id: parseInt(item.id),
                count: 1,
                itemName: item.name,
                icon: this.getIconNameFromItemName(item.name),
                price: Math.floor(item.price * 0.9) // Store the purchase price
            };

            inventoryItems.push(newItem);
            console.log(`Added new item ${item.name} to inventory`);
        }

        // Save updated inventory
        sys.localStorage.setItem(USER_DATA_KEY, JSON.stringify(inventoryItems));
        console.log('Saved updated inventory');
    }

    /**
     * Remove item from inventory
     * @param item The item to remove from inventory
     */
    private removeItemFromInventory(item: ShopItem): void {
        // Get current inventory
        const dataString = sys.localStorage.getItem(USER_DATA_KEY);
        let inventoryItems: ItemData[] = [];

        if (dataString) {
            try {
                inventoryItems = JSON.parse(dataString);
            } catch (e) {
                console.error('Failed to parse inventory data:', e);
                return;
            }
        } else {
            console.error('No inventory data found');
            return;
        }

        // Find item in inventory
        const existingItemIndex = inventoryItems.findIndex(i => i.itemName === item.name);

        if (existingItemIndex !== -1) {
            // Decrement count if item exists and count > 1
            if (inventoryItems[existingItemIndex].count > 1) {
                inventoryItems[existingItemIndex].count -= 1;
                console.log(`Decremented count of ${item.name} in inventory to ${inventoryItems[existingItemIndex].count}`);
            } else {
                // Remove item if count is 1
                inventoryItems.splice(existingItemIndex, 1);
                console.log(`Removed ${item.name} from inventory`);
            }

            // Save updated inventory
            sys.localStorage.setItem(USER_DATA_KEY, JSON.stringify(inventoryItems));
            console.log('Saved updated inventory');

            // Update the shop display to reflect the changes
            if (this._currentMode === ShopMode.SELL) {
                // Convert inventory items to shop items
                const shopItems = inventoryItems.map(item => {
                    return {
                        id: item.id.toString(),
                        name: item.itemName,
                        price: this.getPriceForItem(item.itemName, item),
                        description: `${item.itemName} (${item.count} available)`
                    };
                });

                // Update the shop with inventory items
                this.setItems(shopItems);
            }
        } else {
            console.error(`Item ${item.name} not found in inventory`);
        }
    }

    /**
     * Get icon name from item name
     * @param itemName The name of the item
     * @returns The icon name for the item
     */
    private getIconNameFromItemName(itemName: string): string {
        // Map item names to icon names
        const iconMap = {
            'Lotos Seeds': 'potion_icon',
            'Blue Lotos': 'potion_icon',
            'Red Lotos': 'potion_icon',
            'Lotos Root': 'potion_icon',
            'White Lotos': 'potion_icon',
            'Lotos Petals': 'potion_icon',
            'Lotos Extract': 'potion_icon',
            'Lotos Incense': 'potion_icon',
            'Lotos Powder': 'potion_icon',
            'Lotos Elixir': 'potion_icon',
            'Lotos Amulet': 'key_icon',
            'Lotos Scroll': 'key_icon',
            'Lotos Tea': 'potion_icon',
            'Lotos Candle': 'key_icon',
            'Lotos Oil': 'potion_icon',
            'Lotos Charm': 'key_icon',
            'Lotos Ink': 'potion_icon',
            'Lotos Soap': 'potion_icon',
            'Lotos Mask': 'key_icon',
            'Lotos Tonic': 'potion_icon',
            'Lotos Crystal': 'key_icon',
            'Lotos Perfume': 'potion_icon',
            'Lotos Bracelet': 'key_icon',
            'Lotos Remedy': 'potion_icon',
            'Меч': 'sword_icon',
            'Щит': 'shield_icon',
            'Зелье': 'potion_icon',
            'Лук': 'bow_icon',
            'Ключ': 'key_icon'
        };

        // Return the icon name if it exists in the map, otherwise return a default icon
        return iconMap[itemName] || 'key_icon';
    }

    /**
     * Get price for an item
     * @param itemName The name of the item
     * @param inventoryItem Optional inventory item data (for accessing purchase price)
     * @returns The price of the item
     */
    private getPriceForItem(itemName: string, inventoryItem?: ItemData): number {
        // If we have inventory item data with a purchase price and we're in SELL mode,
        // return 90% of the purchase price
        if (this._currentMode === ShopMode.SELL && inventoryItem && inventoryItem.price !== undefined) {
            const sellPrice = inventoryItem.price; // 90% of purchase price
            console.log(`Selling ${itemName} for ${sellPrice} (${inventoryItem.price})`);
            return sellPrice;
        }

        // Default items with hardcoded prices
        const defaultItems = {
            'Меч': 100,
            'Щит': 80,
            'Зелье': 30,
            'Лук': 120,
            'Ключ': 50
        };

        // Check if it's a default item
        if (itemName in defaultItems) {
            return defaultItems[itemName];
        }

        // For shop items, find the price in the default items list
        const defaultItem = this._defaultItems.find(item => item.name === itemName);
        if (defaultItem && defaultItem.price !== undefined) {
            return defaultItem.price;
        }

        // For non-default items, generate a random price between 1 and 10000
        return Math.floor(Math.random() * 10000) + 1;
    }

    resetDefaultItems(): void {
        // Get the current shop level and capacity
        if (ShopLvlManager.instance) {
            const currentLevel = ShopLvlManager.instance.getLevel();
            const levelData = SHOP_LEVELS.get(currentLevel);

            if (levelData) {
                // Trim the default items based on the shop level capacity
                this._items = this._defaultItems.slice(0, levelData.capacity);
                console.log(`Reset default items: trimmed to ${this._items.length} items based on shop level ${currentLevel} (capacity: ${levelData.capacity})`);
            } else {
                // Fallback if level data not found
                this._items = this._defaultItems;
                console.warn(`Shop level data not found for level ${currentLevel}, using all default items`);
            }
        } else {
            // Fallback if ShopLvlManager is not available
            this._items = this._defaultItems;
            console.warn('ShopLvlManager not available, using all default items');
        }

        // Reset pagination to the first page
        this.resetPagination();
    }

    /**
     * Reset pagination to the first page
     */
    public resetPagination(): void {
        this._currentPage = 0;
    }

    /**
     * Get the current shop mode
     * @returns Current shop mode (BUY or SELL)
     */
    public getMode(): ShopMode {
        return this._currentMode;
    }

    /**
     * Set the shop mode
     * @param mode Shop mode to set (BUY or SELL)
     */
    public setMode(mode: ShopMode): void {
        if (this._currentMode !== mode) {
            this._currentMode = mode;
            console.log(`Shop mode changed to: ${mode}`);
        }
    }

    /**
     * Set shop items and refresh the display
     * @param items Array of shop items to display
     */
    public setItems(items: ShopItem[]): void {
        this._items = items;
        this.resetPagination();
        this.refreshShop();
    }

    /**
     * Get the current shop items
     * @returns Array of shop items
     */
    public getItems(): ShopItem[] {
        return this._items;
    }

    /**
     * Add a single item to the shop
     * @param item Item to add
     */
    public addItem(item: ShopItem): void {
        this._items.push(item);
        this.resetPagination();
        this.refreshShop();
    }

    /**
     * Remove an item from the shop by id
     * @param id ID of the item to remove
     * @returns True if item was found and removed, false otherwise
     */
    public removeItem(id: string): boolean {
        const initialLength = this._items.length;
        this._items = this._items.filter(item => item.id !== id);

        if (this._items.length !== initialLength) {
            this.resetPagination();
            this.refreshShop();
            return true;
        }

        return false;
    }

    /**
     * Clear all items from the shop
     */
    public clearItems(): void {
        this._items = [];
        this.resetPagination();
        this.refreshShop();
    }

    /**
     * Navigate to the previous page
     */
    public previousPage(): void {
        if (this._currentPage > 0) {
            this._currentPage--;
            this.refreshShop();
        }
    }

    /**
     * Navigate to the next page
     */
    public nextPage(): void {
        const totalPages = Math.ceil(this._items.length / this._itemsPerPage);
        if (this._currentPage < totalPages - 1) {
            this._currentPage++;
            this.refreshShop();
        }
    }

    /**
     * Get the total number of pages
     */
    private getTotalPages(): number {
        return Math.ceil(this._items.length / this._itemsPerPage);
    }

    /**
     * Refresh the shop display based on current items and page
     */
    public refreshShop(): void {
        console.log(`Refreshing shop in ${this._currentMode.toUpperCase()} mode with`, this._items.length, 'items, page', this._currentPage + 1, 'of', this.getTotalPages());

        // Clear existing buttons
        this._buttonNodes.forEach(node => {
            node.removeFromParent();
            node.destroy();
        });
        this._buttonNodes = [];

        // Clear existing navigation buttons
        this._navigationButtons.forEach(node => {
            node.removeFromParent();
            node.destroy();
        });
        this._navigationButtons = [];

        if (!this.buttonPrefab) {
            console.error('Button prefab is not set for ScrollableShop');
            return;
        }

        console.log('Using button prefab:', this.buttonPrefab.name);

        // Get content size or add UITransform if it doesn't exist
        let transform = this.node.getComponent(UITransform);
        if (!transform) {
            transform = this.node.addComponent(UITransform);
            transform.width = 500; // Larger default width
            transform.height = 500; // Larger default height
            console.warn('Added UITransform component to ScrollableShop node with size:', transform.width, 'x', transform.height);
        } else {
            // Ensure the transform has a reasonable size
            if (transform.width < 100 || transform.height < 100) {
                transform.width = Math.max(transform.width, 500);
                transform.height = Math.max(transform.height, 500);
                console.warn('Increased ScrollableShop node size to:', transform.width, 'x', transform.height);
            }
            console.log('ScrollableShop node size:', transform.width, 'x', transform.height);
        }

        const contentWidth = transform.width;
        // Use a smaller width for buttons to ensure they fit in Background (1)
        const buttonWidth = Math.min(
            (contentWidth - this.paddingLeft - this.paddingRight - (this.columnCount - 1) * this.spacing) / this.columnCount,
            120 // Maximum button width to ensure they fit in Background (1)
        );

        // Calculate the start and end indices for the current page
        const startIndex = this._currentPage * this._itemsPerPage;
        const endIndex = Math.min(startIndex + this._itemsPerPage, this._items.length);
        const itemsToShow = this._items.slice(startIndex, endIndex);

        console.log(`Showing items ${startIndex + 1} to ${endIndex} (${itemsToShow.length} items)`);

        // Create buttons for the current page's items
        itemsToShow.forEach((item, index) => {
            console.log('Creating button for item:', item.name, '(ID:', item.id, ')');
            const buttonNode = instantiate(this.buttonPrefab);
            this._buttonNodes.push(buttonNode);
            this.node.addChild(buttonNode);
            console.log('Button node added to parent');

            // Set button position based on index
            // For a 2x4 grid layout (2 columns, 3 rows for items, 1 row for navigation)
            const column = index % 2;
            const row = Math.floor(index / 2);

            // Get or add UITransform component to button node
            let buttonTransform = buttonNode.getComponent(UITransform);
            if (!buttonTransform) {
                buttonTransform = buttonNode.addComponent(UITransform);
                buttonTransform.width = 100; // Default width
                buttonTransform.height = 40; // Default height
                console.warn('Added UITransform component to button node with default size');
            }

            // Adjust button size to ensure it fits in Background (1)
            // Keep the original aspect ratio but limit the size
            const originalWidth = buttonTransform.width;
            const originalHeight = buttonTransform.height;
            const aspectRatio = originalHeight / originalWidth;

            buttonTransform.width = Math.min(originalWidth, buttonWidth);
            buttonTransform.height = buttonTransform.width * aspectRatio;

            // Calculate fixed step sizes to maintain consistent spacing
            const horizontalStep = this._rightX - this._leftX; // Distance between leftX and rightX

            // Calculate vertical step for 4 rows to ensure bottom-right button is at the correct position
            // For 4 rows, we need 3 steps from top to bottom
            const verticalStep = (this._topY - this._bottomY) / 3;

            // Calculate position based on row and column
            // For a 2x4 grid layout where the bottom row is for navigation buttons
            const x = this._leftX + column * horizontalStep;
            const y = this._topY - row * verticalStep;

            buttonNode.position = new Vec3(x, y, 0);
            console.log(`Button positioned at (${x}, ${y}) for item ${item.name}`);

            // Set button name and other properties
            buttonNode.name = `Button-${item.id}`;
            console.log(`Button named: ${buttonNode.name}`);

            // Set button label if it exists (check both "Label" and "Name" nodes)
            let labelNode = buttonNode.getChildByName('Label');
            if (!labelNode) {
                // Try to find a "Name" node instead
                labelNode = buttonNode.getChildByName('Name');
                if (labelNode) {
                    console.log(`Found Name node for button ${buttonNode.name}`);
                }
            } else {
                console.log(`Found Label node for button ${buttonNode.name}`);
            }

            if (labelNode) {
                const label = labelNode.getComponent(Label);
                if (label) {
                    label.string = item.name;
                    console.log(`Set label text to: ${item.name}`);
                } else {
                    console.warn(`Label component not found on label node for button ${buttonNode.name}`);
                }
            } else {
                console.warn(`Neither Label nor Name node found for button ${buttonNode.name}`);

                // Check if there's a child Button node that might contain the label
                const buttonChildNode = buttonNode.getChildByName('Button');
                if (buttonChildNode) {
                    console.log(`Found Button child node for button ${buttonNode.name}`);

                    // Try to find a "Name" node in the Button child
                    const nameInButtonNode = buttonChildNode.getChildByName('Name');
                    if (nameInButtonNode) {
                        console.log(`Found Name node in Button child for button ${buttonNode.name}`);
                        const label = nameInButtonNode.getComponent(Label);
                        if (label) {
                            label.string = item.name;
                            console.log(`Set label text to: ${item.name}`);
                        }
                    }
                }
            }

            // Set price box if it exists
            let priceBoxNode = buttonNode.getChildByName('PriceBox');
            let priceLabel = null;

            if (!priceBoxNode) {
                // Try to find the price in the Rectangle 3 -> price structure
                const rectangleNode = buttonNode.getChildByName('Rectangle 3');
                if (rectangleNode) {
                    console.log(`Found Rectangle 3 node for button ${buttonNode.name}`);
                    const priceNode = rectangleNode.getChildByName('price');
                    if (priceNode) {
                        console.log(`Found price node in Rectangle 3 for button ${buttonNode.name}`);
                        priceLabel = priceNode.getComponent(Label);
                    }
                }

                // If still not found, check if there's a Button child that might contain the price
                if (!priceLabel) {
                    const buttonChildNode = buttonNode.getChildByName('Button');
                    if (buttonChildNode) {
                        const rectangleInButtonNode = buttonChildNode.getChildByName('Rectangle 3');
                        if (rectangleInButtonNode) {
                            console.log(`Found Rectangle 3 node in Button child for button ${buttonNode.name}`);
                            const priceInRectangleNode = rectangleInButtonNode.getChildByName('price');
                            if (priceInRectangleNode) {
                                console.log(`Found price node in Rectangle 3 in Button child for button ${buttonNode.name}`);
                                priceLabel = priceInRectangleNode.getComponent(Label);
                            }
                        }
                    }
                }
            } else {
                console.log(`Found PriceBox node for button ${buttonNode.name}`);
                priceLabel = priceBoxNode.getComponent(Label);
            }

            if (priceLabel && item.price !== undefined) {
                priceLabel.string = item.price.toString();
                console.log(`Set price text to: ${item.price}`);
            } else if (!priceLabel) {
                console.warn(`Price label component not found for button ${buttonNode.name}`);
            }

            // Set button click event
            let button = buttonNode.getComponent(Button);

            // If the button component is not on the root node, check if there's a Button child node
            if (!button) {
                const buttonChildNode = buttonNode.getChildByName('Button');
                if (buttonChildNode) {
                    button = buttonChildNode.getComponent(Button);
                    if (button) {
                        console.log(`Found Button component on Button child node for button ${buttonNode.name}`);
                    }
                }
            } else {
                console.log(`Found Button component for button ${buttonNode.name}`);
            }

            if (button) {
                button.node.on(Node.EventType.TOUCH_END, () => {
                    this.onButtonClicked(item);
                });
                console.log(`Set click event for button ${buttonNode.name}`);
            } else {
                console.warn(`Button component not found for button ${buttonNode.name}`);
            }
        });

        // Add navigation buttons at the bottom
        this.createNavigationButtons();
    }

    /**
     * Create navigation buttons for page switching
     */
    private createNavigationButtons(): void {
        if (!this.navigationButtonPrefab) {
            console.warn('Navigation button prefab is not set for ScrollableShop');
            return;
        }

        const totalPages = this.getTotalPages();
        if (totalPages <= 1) {
            // No need for navigation buttons if there's only one page
            return;
        }

        // Create previous button
        const prevButton = instantiate(this.navigationButtonPrefab);
        prevButton.name = 'PrevButton';
        this.node.addChild(prevButton);
        this._navigationButtons.push(prevButton);

        // Create next button
        const nextButton = instantiate(this.navigationButtonPrefab);
        nextButton.name = 'NextButton';
        this.node.addChild(nextButton);
        this._navigationButtons.push(nextButton);

        // Position buttons in the bottom row of the grid (row 4)
        // Calculate the y-position for the bottom row (row 4)
        const bottomRowY = this._topY - 3 * ((this._topY - this._bottomY) / 3);

        // Use the same horizontal spacing as the shop items
        prevButton.position = new Vec3(this._leftX, bottomRowY, 0);
        nextButton.position = new Vec3(this._rightX, bottomRowY, 0);

        // Set button labels
        this.setButtonLabel(prevButton, '←');
        this.setButtonLabel(nextButton, '→');

        // Set button click events
        const prevButtonComp = this.getButtonComponent(prevButton);
        const nextButtonComp = this.getButtonComponent(nextButton);

        if (prevButtonComp) {
            prevButtonComp.node.on(Node.EventType.TOUCH_END, () => {
                this.previousPage();
            });

            // Disable button if on first page
            prevButtonComp.interactable = this._currentPage > 0;
        }

        if (nextButtonComp) {
            nextButtonComp.node.on(Node.EventType.TOUCH_END, () => {
                this.nextPage();
            });

            // Disable button if on last page
            nextButtonComp.interactable = this._currentPage < totalPages - 1;
        }
    }

    /**
     * Helper method to set a button's label text
     */
    private setButtonLabel(buttonNode: Node, text: string): void {
        // Try to find a Label component in the button or its children
        let labelNode = buttonNode.getChildByName('Label');
        if (!labelNode) {
            labelNode = buttonNode.getChildByName('Name');
        }

        if (labelNode) {
            const label = labelNode.getComponent(Label);
            if (label) {
                label.string = text;
            }
        } else {
            // Check if there's a child Button node that might contain the label
            const buttonChildNode = buttonNode.getChildByName('Button');
            if (buttonChildNode) {
                const nameInButtonNode = buttonChildNode.getChildByName('Name');
                if (nameInButtonNode) {
                    const label = nameInButtonNode.getComponent(Label);
                    if (label) {
                        label.string = text;
                    }
                }
            }
        }
    }

    /**
     * Helper method to get a Button component from a node
     */
    private getButtonComponent(buttonNode: Node): Button {
        let button = buttonNode.getComponent(Button);

        if (!button) {
            const buttonChildNode = buttonNode.getChildByName('Button');
            if (buttonChildNode) {
                button = buttonChildNode.getComponent(Button);
            }
        }

        return button;
    }

    /**
     * Handle button click event
     * @param item The item associated with the clicked button
     */
    private onButtonClicked(item: ShopItem): void {
        // Emit different events based on the current shop mode
        if (this._currentMode === ShopMode.BUY) {
            // In BUY mode, emit 'item-selected' event (for purchasing)
            this.node.emit('item-selected', item);
            console.log(`BUY mode: Selected item ${item.name} (${item.id}) for purchase`);
        } else if (this._currentMode === ShopMode.SELL) {
            // In SELL mode, emit 'item-sold' event
            this.node.emit('item-sold', item);
            console.log(`SELL mode: Selected item ${item.name} (${item.id}) for selling`);
        }
    }
}
