import {
  _decorator,
  Component,
  Node,
  Label,
  Sprite,
  resources,
  SpriteFrame,
} from "cc";
const { ccclass, property } = _decorator;

// Определяем интерфейс для наших данных для строгой типизации
export interface ItemData {
  id: number;
  count: number;
  itemName: string;
  icon: string;
}

@ccclass("ItemController")
export class ItemController extends Component {
  @property(Sprite)
  public iconSprite: Sprite = null;

  @property(Label)
  public nameLabel: Label = null;

  @property(Label)
  public Count: Label = null;

  @property(Node)
  public labelNode: Node = null;

  // Метод для инициализации элемента данными
  init(data: ItemData) {
    console.log(data);

    // Устанавливаем название
    if (this.nameLabel) {
      this.nameLabel.string = data.itemName;
    }

    if (this.Count) {
      this.Count.string = data.count?.toString();
    }

    // Динамически загружаем иконку из папки `resources`
    const iconPath = `icons/${data.icon}/spriteFrame`; // Пример пути: resources/icons/sword_icon/spriteFrame
    resources.load(iconPath, SpriteFrame, (err, spriteFrame) => {
      if (err) {
        console.error("Error loading icon:", err);
        const iconPath = `icons/default/spriteFrame`;
        resources.load(iconPath, SpriteFrame, (err, spriteFrame) => {
          if (err) {
            console.error("Error loading default icon:", err);
            return;
          }
          this.iconSprite.spriteFrame = spriteFrame;
        });
        return;
      }
      if (this.iconSprite && this.iconSprite.isValid) {
        this.iconSprite.spriteFrame = spriteFrame;
      }
    });
  }

  start() {
    if (this.labelNode) {
      this.labelNode.active = false;
    }
  }

  public showSelection() {
    if (this.labelNode) {
      this.labelNode.active = true;
    }
  }

  // Скрывает индикатор выбора
  public hideSelection() {
    if (this.labelNode) {
      this.labelNode.active = false;
    }
  }
}
