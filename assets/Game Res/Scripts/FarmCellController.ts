import {
  _decorator,
  Component,
  Node,
  Prefab,
  instantiate,
  sys,
  Label,
  Layout,
  UITransform,
  Sprite,
  Color,
  SpriteFrame,
  resources,
} from "cc";

const { ccclass, property } = _decorator;

// Интерфейс для данных предметов
export interface ItemData {
  id: number;
  count: number;
  itemName: string;
  icon: string;
}

// Интерфейс для данных фермы (посаженных растений)
export interface FarmCellData {
  row: number;
  col: number;
  plantedItem: ItemData | null;
  isActionCell: boolean;
  actionType?: "plant" | "chop";
  isLocked: boolean;
  
  
}
@ccclass("FarmCellController")
export class FarmCellController extends Component {
  @property(Label)
  public label: Label = null;

  @property(Sprite)
  public icon: Sprite = null;

  @property(Sprite)
  public background: Sprite = null;

  @property(Color)
  public selectedColor: Color = Color.BLUE;
   @property(Node) lockNode: Node = null;

  @property(Color)
  public defaultColor: Color = Color.WHITE;


    @property(Sprite)
    lockSprite: Sprite = null;


  public setupActionCell(text: string, iconSprite: SpriteFrame, isLocked: boolean) {
    this.label.string = text;
    this.icon.spriteFrame = iconSprite;
    this.background.color = this.defaultColor;
    // this.lockSprite.enabled = isLocked;
     this.lockNode.active = !isLocked;
  }

  public setupPlantCell(text: string, iconName: string | null, isLocked: boolean) {
    this.label.string = text;
    
    if (iconName) {
      const iconPath = `icons/${iconName}/spriteFrame`;
      resources.load(iconPath, SpriteFrame, (err, spriteFrame) => {
        if (err) {
          console.error("Error loading icon:", err);
          return;
        }
        this.icon.spriteFrame = spriteFrame;
      });
    } else {
      this.icon.spriteFrame = null;
    }
    
    this.background.color = this.defaultColor;
    console.log(isLocked);
    // this.lockSprite.enabled = isLocked;
     this.lockNode.active = isLocked;
  }

  public setSelected(isSelected: boolean) {
    this.background.color = isSelected ? this.selectedColor : this.defaultColor;
  }
  public setLocked(isLocked: boolean) {
        // this.lockSprite.enabled = isLocked;
        this.lockNode.active = isLocked;
    }
}


