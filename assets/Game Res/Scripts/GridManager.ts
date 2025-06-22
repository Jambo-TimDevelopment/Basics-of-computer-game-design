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
  EventTouch,
} from "cc";
import { ItemController, ItemData } from "./ItemController"; // Импортируем наш контроллер и интерфейс
const { ccclass, property } = _decorator;

const USER_DATA_KEY = "userData";

@ccclass("GridManager")
export class GridManager extends Component {
  @property(Prefab)
  public itemPrefab: Prefab = null;

  @property(Node)
  public contentNode: Node = null; // Ссылка на узел 'content' в ScrollView

  start() {
    this.data = this.getUserData();
    this.populateGrid();
  }

  // Ссылка на текущий выбранный элемент
  private _selectedItem: ItemController = null;

  private data: ItemData[] = [];

  // Главный метод для заполнения грида
  populateGrid() {
    this.contentNode.removeAllChildren();
    const data = this.getUserData();
    for (const itemData of data) {
      const itemNode = instantiate(this.itemPrefab);

      const itemController = itemNode.getComponent(ItemController);
      if (itemController) {
        itemController.init(itemData);
      }

      itemNode.on(
        Node.EventType.TOUCH_END,
        (event: EventTouch) => {
          this.onItemClicked(itemController);
          // Останавливаем "всплытие" события, чтобы не сработал клик по экрану
          event.propagationStopped = true;
        },
        this
      );

      this.contentNode.addChild(itemNode);
    }
  }

  public onItemClicked(item: ItemController) {
    // Если уже был выбран какой-то итем, прячем его выделение
    if (this._selectedItem && this._selectedItem !== item) {
      this._selectedItem.hideSelection();
    }

    // Устанавливаем и показываем новый выбранный итем
    this._selectedItem = item;
    this._selectedItem.showSelection();

    console.log(`Выбран предмет: ${item.name}`);
  }

  private updateContentSize() {
    const layout = this.contentNode.getComponent(Layout);
    if (!layout || layout.type !== Layout.Type.GRID) {
      console.warn("Layout не является типом GRID или отсутствует на content");
      return;
    }

    const itemsCount = this.data.length;
    if (itemsCount === 0) {
      this.contentNode.getComponent(UITransform).height = 0;
      return;
    }

    // Получаем параметры из Layout компонента
    const viewWidth = this.contentNode.parent.getComponent(UITransform).width; // Ширина 'view'
    const cellWidth = layout.cellSize.width;
    const cellHeight = layout.cellSize.height;
    const spacingX = layout.spacingX;
    const spacingY = layout.spacingY;
    const paddingTop = layout.paddingTop;
    const paddingBottom = layout.paddingBottom;
    const paddingLeft = layout.paddingLeft;
    const paddingRight = layout.paddingRight;

    // Рассчитываем, сколько ячеек помещается в один ряд
    const contentWidth = viewWidth - paddingLeft - paddingRight;
    const itemsPerRow = Math.floor(
      (contentWidth + spacingX) / (cellWidth + spacingX)
    );

    const numRows = Math.ceil(itemsCount / itemsPerRow);

    const newHeight =
      numRows * cellHeight +
      (numRows - 1) * spacingY +
      paddingTop +
      paddingBottom;

    this.contentNode.getComponent(UITransform).height = newHeight;

    console.log(
      `Обновлен размер Content: ${
        this.contentNode.getComponent(UITransform).width
      }x${newHeight}, Рядов: ${numRows}`
    );
  }

  // Вспомогательный метод для получения данных
  private getUserData(): ItemData[] {
    sys.localStorage.removeItem(USER_DATA_KEY);
    let dataString = sys.localStorage.getItem(USER_DATA_KEY);

    if (!dataString) {
      // Если данных нет, создаем и сохраняем демо-данные
      console.log("No user data found. Creating demo data.");
      const demoData: ItemData[] = [
        { id: 1, count: 10, itemName: "Меч", icon: "sword_icon" },
        { id: 2, count: 10, itemName: "Щит", icon: "shield_icon" },
        { id: 3, count: 10, itemName: "Зелье", icon: "potion_icon" },
        { id: 4, count: 10, itemName: "Лук", icon: "bow_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
        { id: 5, count: 10, itemName: "Ключ", icon: "key_icon" },
      ];
      sys.localStorage.setItem(USER_DATA_KEY, JSON.stringify(demoData));
      dataString = JSON.stringify(demoData);
    }

    try {
      return JSON.parse(dataString);
    } catch (e) {
      console.error("Failed to parse user data:", e);
      return []; // Возвращаем пустой массив в случае ошибки
    }
  }
}
