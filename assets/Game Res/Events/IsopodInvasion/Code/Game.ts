import { Containers } from './Containers';
import { Isopods } from './Isopods';

import { _decorator, view, log, Vec3, Component, Node, Prefab, ProgressBar, Label, SpriteFrame, Sprite, Color, instantiate, sys } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Game')
export class Game extends Component {
    @property(Containers)
    containers: Containers = null!;

    @property(Prefab)
    isopodPrefab: Prefab = null!;

    @property(ProgressBar)
    timerBar: ProgressBar = null!;

    @property(Label)
    timerLabel: Label = null!;

    @property(Label)
    scoreLabel: Label = null!;

    @property(SpriteFrame)
    greenIsopodSprite: SpriteFrame = null!;

    @property(SpriteFrame)
    yellowIsopodSprite: SpriteFrame = null!;

    @property(SpriteFrame)
    redIsopodSprite: SpriteFrame = null!;

    private readonly TOTAL_ISOPODS = 11;
    private isopods: Node[] = [];
    private timeLeft = 0;
    private gameActive = false;
    private score = 0;

    private readonly GAME_WIDTH = 409;
    private readonly GAME_HEIGHT = 811;

    start() {
        // Получаем реальный размер экрана
        const visibleSize = view.getVisibleSize();
        const designSize = { width: 409, height: 811 };
        
        // Рассчитываем масштаб для подгонки под дизайн-размер
        const scale = Math.min(
            visibleSize.width / designSize.width,
            visibleSize.height / designSize.height
        );
        
        // Устанавливаем масштаб для корневого узла
        this.node.setScale(new Vec3(scale, scale, 1));
        
        // Инициализируем контейнеры с дизайн-размерами
        this.containers.init(designSize.width, designSize.height);
    }

    startGame() {

        if (this.gameActive == true) {
            this.endGame();
        }

        this.gameActive = true;
        this.timeLeft = 60;
        this.score = 0;
        this.updateScore();
        this.spawnInitialIsopods();
        this.schedule(this.updateGame, 1);
    }
    
    private updateTimer() {
        if (this.timerBar && this.timerBar.barSprite) {
            this.timerBar.progress = this.timeLeft / 60;
            this.timerLabel.string = this.timeLeft.toString();

            if (this.timeLeft <= 10) {
                const sprite = this.timerBar.barSprite.getComponent(Sprite);
                if (sprite) {
                    sprite.color = Color.RED;
                }
            }
        }
    }
    
    onLoad() {
        this.containers.init(this.GAME_WIDTH, this.GAME_HEIGHT);
    }

    endGame() {
        this.gameActive = false;
        this.unschedule(this.updateGame);
        this.destroyRemainingContainers();
        this.saveResources();
    }

    private updateGame() {
        if (!this.gameActive) return;

        this.timeLeft--;
        this.updateTimer();

        if (this.timeLeft <= 0) {
            this.endGame();
        }
    }

    private updateScore() {
        this.scoreLabel.string = `Уничтожено: ${this.score}`;
    }

    private spawnInitialIsopods() {
        const availablePositions = this.containers.getAllContainerPositions();
        
        // Перемешиваем позиции
        for (let i = availablePositions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [availablePositions[i], availablePositions[j]] = [availablePositions[j], availablePositions[i]];
        }

        // Спавним 11 изоподов на случайных контейнерах
        for (let i = 0; i < Math.min(this.TOTAL_ISOPODS, availablePositions.length); i++) {
            const maxHealth = Math.floor(Math.random() * 30) + 10; // 1-3 здоровья
            this.spawnIsopod(availablePositions[i].add(new Vec3(20, 15, 0)), maxHealth);
        }
    }

    private spawnIsopod(position: Vec3, maxHealth: number) {
        const isopod = instantiate(this.isopodPrefab);
        isopod.parent = this.node;
        isopod.setPosition(position);

        const isopodComp = isopod.getComponent(Isopods);
        isopodComp.init({
            maxHealth,
            game: this,
            greenSprite: this.greenIsopodSprite,
            yellowSprite: this.yellowIsopodSprite,
            redSprite: this.redIsopodSprite
        });

        this.isopods.push(isopod);
    }

    public onIsopodClicked(isopod: Isopods) {
        if (!this.gameActive) return;

        isopod.takeDamage(1);

        if (isopod.isDead()) {
            this.destroyIsopod(isopod);
            this.score += isopod.getPoints();
            this.updateScore();

            if (this.isopods.length === 0) {
                this.endGame();
            }
        }
    }

    private destroyIsopod(isopod: Isopods) {
        const index = this.isopods.indexOf(isopod.node);
        if (index !== -1) {
            this.isopods.splice(index, 1);
            isopod.node.destroy();
        }
    }

    private destroyRemainingContainers() {
        for (const isopod of this.isopods) {
            const comp = isopod.getComponent(Isopods);
            comp?.destroyContainer();
            isopod.destroy();
        }
        this.isopods = [];
    }

    private saveResources() {
        const savedResources = this.containers.countActiveContainers() * 10;
        sys.localStorage.setItem('playerResources', savedResources.toString());
        
        if (this.isopods.length === 0) {
            log(`Победа! Сохранено ресурсов: ${savedResources}`);
        } else {
            log(`Поражение! Сохранено ресурсов: ${savedResources}`);
        }
    }
}


