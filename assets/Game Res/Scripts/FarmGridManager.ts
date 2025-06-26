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
  Color,director,
  SpriteFrame,
  resources,
} from "cc";
const { ccclass, property } = _decorator;
import { FarmCellController,ItemData, FarmCellData } from "./FarmCellController";
import { GardenLevelManager, EVENT_GARDEN_LEVEL_UPDATED } from './GardenLevelManager';
 // Импортируем наш контроллер и интерфейс
const USER_DATA_KEY = "userData";
const FARM_DATA_KEY = "farmData";
const TOTAL_ROWS = 10; // Всего строк
const COLUMNS = 3; // Колонки (2 для растений, 1 для действий)
const INITIAL_UNLOCKED_ROWS = 8; // Изначально разблокировано 2 строки


@ccclass("FarmGridManager")
export class FarmGridManager extends Component {
  @property(Prefab)
  public cellPrefab: Prefab = null;

  @property(Node)
  public contentNode: Node = null;

  @property(SpriteFrame)
  public plantActionSprite: SpriteFrame = null;

  @property(SpriteFrame)
  public chopActionSprite: SpriteFrame = null;

  @property(SpriteFrame)
  public emptyCellSprite: SpriteFrame = null;

  private rows = 6; // Начальное количество строк
  private cols = 3; // 3 колонки (2 для растений, 1 для действий)
  private selectedAction: "plant" | "chop" | null = null;
  private selectedCell: Node | null = null;
  private farmData: FarmCellData[] = [];
  private inventoryData: ItemData[] = [];
  private unlockedRows: number = INITIAL_UNLOCKED_ROWS;
  private gardenLevelManager: GardenLevelManager = null;

  start() {
    this.loadData();
    this.createGrid();
     director.on(EVENT_GARDEN_LEVEL_UPDATED, this.onGardenLevelUpdated, this);
    }

    onDestroy() {
        director.off(EVENT_GARDEN_LEVEL_UPDATED, this.onGardenLevelUpdated, this);
    }
  
    private onGardenLevelUpdated() {
    console.log("Garden level updated");

    // Обновляем количество открытых строк на основании уровня из GardenLevelManager
    const currentLevel = this.gardenLevelManager.getCurrentLevel();
    this.unlockedRows = currentLevel.unlockedCells;

    // Разблокируем ячейки до новой строки
    this.farmData.forEach(cell => {
        if (cell.row < this.unlockedRows) {
            cell.isLocked = false;
        }
    });

    // Сохраняем изменения
    sys.localStorage.setItem(FARM_DATA_KEY, JSON.stringify(this.farmData));

    // Перерисовываем сетку
    this.createGrid();
}


  private loadData() {
      this.gardenLevelManager = GardenLevelManager.instance;
    console.log("load");
    // Загружаем данные инвентаря
    let inventoryString = sys.localStorage.getItem(USER_DATA_KEY);
    if (!inventoryString) {
      this.inventoryData = this.createDefaultInventory();
      sys.localStorage.setItem(USER_DATA_KEY, JSON.stringify(this.inventoryData));
    } else {
      this.inventoryData = JSON.parse(inventoryString);
    }

    // Загружаем данные фермы
    let farmString = sys.localStorage.getItem(FARM_DATA_KEY);
    if (!farmString) {
      this.farmData = this.createDefaultFarmData();
      sys.localStorage.setItem(FARM_DATA_KEY, JSON.stringify(this.farmData));
    } else {
      this.farmData = JSON.parse(farmString);
    }
  }

  private createDefaultInventory(): ItemData[] {
    return [
      { id: 1, count: 5, itemName: "Морковь", icon: "carrot_icon" },
      { id: 2, count: 5, itemName: "Картофель", icon: "potato_icon" },
      { id: 3, count: 5, itemName: "Пшеница", icon: "wheat_icon" },
    ];
  }

  // private createDefaultFarmData(): FarmCellData[] {
  //   const data: FarmCellData[] = [];
    
  //   // Создаем ячейки для растений (первые 2 колонки)
  //   for (let row = 0; row < this.rows; row++) {
  //     for (let col = 0; col < this.cols; col++) {
  //       if (col < 2) {
  //         // Ячейки для растений
  //         data.push({
  //           row,
  //           col,
  //           plantedItem: null,
  //           isActionCell: false
  //         });
  //       }
  //     }
  //   }
    
  //   // Добавляем ячейки действий (последняя колонка)
  //   for (let row = 0; row < this.rows; row++) {
  //     data.push({
  //       row,
  //       col: 2, // Последняя колонка
  //       plantedItem: null,
  //       isActionCell: true,
  //       actionType: row === 0 ? "plant" : "chop"
  //     });
  //   }
    
  //   return data;
  // }

  private createDefaultFarmData(): FarmCellData[] {
        const data: FarmCellData[] = [];
        const currentLevel = GardenLevelManager.instance.getCurrentLevel();
        
                
                // Правильный способ изменения активности нода
        
        // Создаем все 10 строк
        for (let row = 0; row < TOTAL_ROWS; row++) {
          const isLocked = row >= currentLevel.unlockedCells;
            const isRowUnlocked = isLocked;
            console.log(row);
            
            // Ячейки растений (первые 2 колонки)
            for (let col = 0; col < 2; col++) {
                data.push({
                    row,
                    col,
                    plantedItem: null,
                    isActionCell: false,
                    isLocked: isLocked
                });
            }
            
            // Ячейка действия (последняя колонка)
            data.push({
                row,
                col: 2,
                plantedItem: null,
                isActionCell: true,
                actionType: row === 0 ? "plant" : "chop",
                isLocked: isLocked
            });
        }
        
        return data;
    }

    
   private createGrid() {
        this.contentNode.removeAllChildren();
        
        // Сортируем данные для правильного отображения
        const sortedData = [...this.farmData].sort((a, b) => {
            if (a.row === b.row) return a.col - b.col;
            return a.row - b.row;
        });

        for (const cellData of sortedData) {
            const cellNode = instantiate(this.cellPrefab);
            const cellController = cellNode.getComponent(FarmCellController);
            
            if (cellController) {
                if (cellData.isActionCell) {
                    cellController.setupActionCell(
                        cellData.actionType === "plant" ? "" : "",
                        cellData.actionType === "plant" ? this.plantActionSprite : this.chopActionSprite,
                        cellData.isLocked
                    );
                } else {
                    cellController.setupPlantCell(
                        cellData.plantedItem ? "" : "",
                        cellData.plantedItem ? cellData.plantedItem.icon : null,
                        cellData.isLocked
                    );
                }
            }

            cellNode.on(Node.EventType.TOUCH_END, () => {
                if (!cellData.isLocked) {
                    this.onCellClicked(cellNode, cellData);
                }
            });

            this.contentNode.addChild(cellNode);
        }
        
        this.updateContentSize();
    }
    public unlockNewRow() {
        if (this.unlockedRows < TOTAL_ROWS) {
            this.unlockedRows++;
            
            // Обновляем состояние ячеек
            this.farmData.forEach(cell => {
                if (cell.row < this.unlockedRows) {
                    cell.isLocked = false;
                }
            });
            
            sys.localStorage.setItem(FARM_DATA_KEY, JSON.stringify(this.farmData));
            this.createGrid(); // Пересоздаем сетку
        }
    }

  private onCellClicked(cellNode: Node, cellData: FarmCellData) {
    const cellController = cellNode.getComponent(FarmCellController);
    
    if (cellData.isActionCell) {
      // Обработка клика на ячейку действия
      this.selectedAction = cellData.actionType;
      this.selectedCell = null;
      
      // Сбрасываем выделение всех ячеек
      this.resetAllSelections();
      
      // Выделяем текущую ячейку действия
      cellController.setSelected(true);
      
      console.log(`Выбрано действие: ${cellData.actionType}`);
    } else {
      // Обработка клика на ячейку растения
      if (this.selectedAction === "plant") {
        this.handlePlantAction(cellNode, cellData, cellController);
      } else if (this.selectedAction === "chop") {
        this.handleChopAction(cellNode, cellData, cellController);
      } else {
        console.log("Сначала выберите действие (Посадить или Срубить)");
      }
    }
  }

  private handlePlantAction(cellNode: Node, cellData: FarmCellData, cellController: FarmCellController) {
    if (cellData.plantedItem) {
      console.log("Здесь уже что-то посажено");
      return;
    }
    
    // Выбираем первый доступный предмет из инвентаря
    const availableItem = this.inventoryData.find(item => item.count > 0);
    
    if (!availableItem) {
      console.log("В инвентаре нет предметов для посадки");
      return;
    }
    
    // Уменьшаем количество в инвентаре
    availableItem.count--;
    sys.localStorage.setItem(USER_DATA_KEY, JSON.stringify(this.inventoryData));
    
    // Сажаем растение
    cellData.plantedItem = { ...availableItem, count: 1 };
    sys.localStorage.setItem(FARM_DATA_KEY, JSON.stringify(this.farmData));
    
    // Обновляем отображение ячейки
    cellController.setupPlantCell("Посажено", cellData.plantedItem.icon,true);
    cellController.setSelected(true);
    this.selectedCell = cellNode;
    
    console.log(`Посажено: ${availableItem.itemName}`);
  }

//   private handleChopAction(cellNode: Node, cellData: FarmCellData, cellController: FarmCellController) {
//     if (!cellData.plantedItem) {
//       console.log("Здесь ничего не посажено");
//       return;
//     }
    
//     // Находим предмет в инвентаре
//     const inventoryItem = this.inventoryData.find(item => item.id === cellData.plantedItem.id);
    
//     if (inventoryItem) {
//       // Увеличиваем количество в инвентаре (возвращаем 2 вместо 1)
//       inventoryItem.count += 2;
//     } else {
//       // Если предмета нет в инвентаре, добавляем его
//       this.inventoryData.push({
//         ...cellData.plantedItem,
//         count: 2
//       });
//     }
    
//     sys.localStorage.setItem(USER_DATA_KEY, JSON.stringify(this.inventoryData));
    
//     // Удаляем растение с поля
//     cellData.plantedItem = null;
//     sys.localStorage.setItem(FARM_DATA_KEY, JSON.stringify(this.farmData));
    
//     // Обновляем отображение ячейки
//     cellController.setupPlantCell("Пусто", null);
//     cellController.setSelected(false);
//     this.selectedCell = null;
    
//     console.log(`Срублено: ${cellData.plantedItem.itemName}, получено 2 единицы`);
//   }
private handleChopAction(cellNode: Node, cellData: FarmCellData, cellController: FarmCellController) {
    // 1. Проверка на null ДО обращения к свойствам
    console.log(cellData.plantedItem);
    if (!cellData.plantedItem) {
        console.log("Здесь ничего не посажено");
        return;
    }
    
    // 2. Сохраняем имя ДО удаления растения
    const itemName = cellData.plantedItem.itemName;
    console.log(itemName);
    const itemId = cellData.plantedItem.id;

    // 3. Находим предмет в инвентаре ПЕРЕД изменением данных
    const inventoryItem = this.inventoryData.find(item => item.id === itemId);
    
    if (inventoryItem) {
        inventoryItem.count += 2;
    } else {
        this.inventoryData.push({
            id: itemId,
            count: 2,
            itemName: itemName,
            icon: cellData.plantedItem.icon
        });
    }
    
    // 4. Сохраняем инвентарь
    sys.localStorage.setItem(USER_DATA_KEY, JSON.stringify(this.inventoryData));
    
    // 5. Удаляем растение только ПОСЛЕ всех операций
    cellData.plantedItem = null;
    sys.localStorage.setItem(FARM_DATA_KEY, JSON.stringify(this.farmData));
    
    // 6. Обновляем отображение
    cellController.setupPlantCell("Пусто", null,false);
    cellController.setSelected(false);
    this.selectedCell = null;
    
    // 7. Используем сохранённое имя
    // console.log(`Срублено: ${itemName}, получено 2 единицы`);
}

  private resetAllSelections() {
    this.contentNode.children.forEach(child => {
      const controller = child.getComponent(FarmCellController);
      if (controller) {
        controller.setSelected(false);
      }
    });
  }

  private updateContentSize() {
        const layout = this.contentNode.getComponent(Layout);
        if (!layout) return;

        const cellHeight = layout.cellSize.height;
        const spacingY = layout.spacingY;
        const paddingTop = layout.paddingTop;
        const paddingBottom = layout.paddingBottom;

        const newHeight = 
            TOTAL_ROWS * cellHeight + 
            (TOTAL_ROWS - 1) * spacingY + 
            paddingTop + 
            paddingBottom;

        this.contentNode.getComponent(UITransform).height = newHeight;
    }
}

