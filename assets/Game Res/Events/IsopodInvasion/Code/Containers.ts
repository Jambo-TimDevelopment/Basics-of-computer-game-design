import { _decorator, Component, Node, SpriteFrame, Prefab, instantiate, Sprite, Vec3, UITransform } from 'cc';
const { ccclass, property } = _decorator;


@ccclass('Containers')
export class Containers extends Component {

    @property(Prefab)
    containerPrefab: Prefab = null;

    @property(SpriteFrame)
    containerSprite: SpriteFrame = null;

    private readonly ROWS = 5;
    private readonly COLS = 4;
    private containers: Node[][] = [];
    private activeContainers: number = 0;

    // Размеры спрайтов (можно менять в редакторе)
    @property
    containerWidth;
    @property
    containerHeight;

    @property
    containerSpacing; // Расстояние между контейнерами

    init(gameWidth: number, gameHeight: number) {
        this.containers = [];
        this.activeContainers = 0;

        // Рассчитываем общий размер сетки с учетом расстояний
        const totalWidth = this.COLS * this.containerWidth + (this.COLS - 1) * this.containerSpacing;
        const totalHeight = this.ROWS * this.containerHeight + (this.ROWS - 1) * this.containerSpacing;

        // Начальная позиция (центрирование)
        const startX = -totalWidth / 2 + this.containerWidth / 2;
        const startY = totalHeight / 2 - this.containerHeight / 2;

        for (let row = 0; row < this.ROWS; row++) {
            this.containers[row] = [];
            for (let col = 0; col < this.COLS; col++) {
                const container = instantiate(this.containerPrefab);
                container.parent = this.node;
                
                // Позиция с учетом расстояний
                const posX = startX + col * (this.containerWidth + this.containerSpacing);
                const posY = startY - row * (this.containerHeight + this.containerSpacing);
                
                container.setPosition(new Vec3(posX, posY, -9));

                // Настройка спрайта
                const sprite = container.getComponent(Sprite);
                if (sprite) {
                    sprite.spriteFrame = this.containerSprite;
                }

                // Установка размера
                const transform = container.getComponent(UITransform);
                if (transform) {
                    transform.width = this.containerWidth;
                    transform.height = this.containerHeight;
                }

                this.containers[row][col] = container;
                this.activeContainers++;
            }
        }
    }

    public getAllContainerPositions(): Vec3[] {
        const positions: Vec3[] = [];
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                if (this.containers[row][col].active) {
                    positions.push(this.containers[row][col].getPosition());
                }
            }
        }
        return positions;
    }

    public destroyContainer(position: Vec3) {
        for (let row = 0; row < this.ROWS; row++) {
            for (let col = 0; col < this.COLS; col++) {
                const container = this.containers[row][col];
                if (container.active && container.getPosition().equals(position)) {
                    container.active = false;
                    this.activeContainers--;
                    return;
                }
            }
        }
    }

    public countActiveContainers(): number {
        return this.activeContainers;
    }
}


