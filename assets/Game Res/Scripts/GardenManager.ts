import { _decorator, Component, Node, Label,director, UIOpacity,Button, Prefab, instantiate, ScrollView, UITransform } from 'cc';
import { GardenLevelManager, EVENT_GARDEN_LEVEL_UPDATED } from './GardenLevelManager';
const { ccclass, property } = _decorator;

@ccclass('GardenManager')
export class GardenManager extends Component {
    @property(Node) improveButton: Node = null;
    @property(Node) shop: Node = null;
    @property(Node) improveGarden: Node = null;
    @property(Label) levelLabel: Label = null;
    @property(Label) improveInfoLabel: Label = null;
    @property(Label) balanceLabel: Label = null;
    @property(Label) bubbleLevelLabel: Label = null;
    @property(Prefab) cellPrefab: Prefab = null;
    @property(Node) gardenContent: Node = null;
    @property(ScrollView) gardenScrollView: ScrollView = null;

    private readonly columns: number = 3;
    private cellSize: number = 200;
    private spacing: number = 10;
     private gardenLevelManager: GardenLevelManager = null;



    

    onLoad() {
         this.gardenLevelManager = GardenLevelManager.instance;
          if (!this.gardenLevelManager) {
            console.error('GardenLevelManager not initialized!');
            this.scheduleOnce(() => this.initializeGame(), 0.5);
            return;
        }
        this.improveGarden.active = false;
        this.initializeGame();
        this.scheduleOnce(() => {
            this.resetScrollPosition();
        }, 0.1);
        director.on(EVENT_GARDEN_LEVEL_UPDATED, this.onGardenLevelUpdated, this);
    }

    onDestroy() {
        director.off(EVENT_GARDEN_LEVEL_UPDATED, this.onGardenLevelUpdated, this);
    }

    initializeGame() {
        // this.createInitialCells();
        this.updateAllTexts();
        this.setupButtonListeners();
        this.scheduleOnce(() => this.resetScrollPosition(), 0.1);
    }

    resetScrollPosition() {
        this.gardenScrollView?.scrollToTop(0.1);
    }

    setupButtonListeners() {
        console.log("setupButtonListeners");
        this.improveButton.on(Button.EventType.CLICK, this.showImproveGarden, this);
        const backButton = this.improveGarden.getChildByName('BackButton').getComponent(Button);
       backButton.node.on(Button.EventType.CLICK, this.hideImproveGarden, this);
       
       const upgradeButton = this.improveGarden.getChildByName('UpgradeButton').getComponent(Button);
       upgradeButton.node.on(Button.EventType.CLICK, this.upgradeLevel, this);
       }

   

    updateScrollContent() {
        const rows = Math.ceil(30 / this.columns);
        const contentHeight = rows * (this.cellSize + this.spacing);
        this.gardenContent.getComponent(UITransform)!.height = contentHeight;
    }

    showImproveGarden() {
        console.log("Improvebtn");
        this.improveButton.active = false;
        this.shop.active = true;
        this.improveGarden.active = true;
         this.gardenScrollView.content.active = false;
     
        
        const nextLevel = GardenLevelManager.instance.getNextLevel();
        const upgradeLabel = this.improveGarden.getChildByName('UpgradeButton')?.getChildByName('Label');
        // if (upgradeLabel && nextLevel) {
        //     upgradeLabel.getComponent(Label)!.string = `Улучшить (${nextLevel.upgradeCost})`;
        // }
    }

    hideImproveGarden() {
        this.improveGarden.active = false;
        this.improveButton.active = true;
        this.shop.active = false;
          this.gardenScrollView.content.active = true;
        
    }

    upgradeLevel() {
        const nextLevel = GardenLevelManager.instance.getNextLevel();

            this.balanceLabel.string = nextLevel.upgradeCost.toString();
            GardenLevelManager.instance.upgrade();
        
    }

    onGardenLevelUpdated() {
        // this.updateCellsState();
        this.updateAllTexts();
        // this.playUnlockEffect();
    }

 

    updateAllTexts() {
        const currentLevel = GardenLevelManager.instance.getCurrentLevel();
        this.levelLabel.string = `Улучшить до уровня ${currentLevel.level}`;
        this.improveInfoLabel.string = `Разблокировано ${currentLevel.unlockedCells}/30`;
        this.bubbleLevelLabel.string = `Ур. ${currentLevel.level}`;
        const nextLevel = GardenLevelManager.instance.getNextLevel();
         this.balanceLabel.string = nextLevel.upgradeCost.toString();
    }
}