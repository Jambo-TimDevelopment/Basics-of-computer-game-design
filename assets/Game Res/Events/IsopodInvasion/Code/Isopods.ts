import { _decorator, UITransform, Button, Component, Node, Sprite, Label, Vec3, Color, SpriteFrame, tween, v3 } from 'cc';
const { ccclass, property } = _decorator;

import { Game } from './Game';

@ccclass('Isopods')
export class Isopods extends Component {
    @property(Sprite)
    sprite: Sprite = null;


    private maxHealth: number;
    private currentHealth: number;
    private game: Game;
    private position: Vec3;
    private greenSprite: SpriteFrame;
    private yellowSprite: SpriteFrame;
    private redSprite: SpriteFrame;

    @property
    isopodWidth = 100;
    @property
    isopodHeight = 100;

    init(config: {
        maxHealth: number,
        game: Game,
        greenSprite: SpriteFrame,
        yellowSprite: SpriteFrame,
        redSprite: SpriteFrame
    }) {
        this.maxHealth = config.maxHealth;
        this.currentHealth = this.maxHealth;
        this.game = config.game;
        this.position = this.node.position.clone();
        this.greenSprite = config.greenSprite;
        this.yellowSprite = config.yellowSprite;
        this.redSprite = config.redSprite;

        // Устанавливаем размер
        const transform = this.node.getComponent(UITransform);
        if (transform) {
            transform.width = this.isopodWidth;
            transform.height = this.isopodHeight;
        }

        this.updateHealthDisplay();
        this.node.on(Node.EventType.TOUCH_END, this.onClick, this);
    }

    private updateHealthDisplay() {
        const healthPercent = (this.currentHealth / this.maxHealth) * 100;

        // Устанавливаем соответствующий спрайт
        if (healthPercent >= 67) {
            this.sprite.spriteFrame = this.greenSprite;
        } else if (healthPercent >= 34) {
            this.sprite.spriteFrame = this.yellowSprite;
        } else {
            this.sprite.spriteFrame = this.redSprite;
        }
    }

    public takeDamage(amount: number) {
        this.currentHealth -= amount;
        this.updateHealthDisplay();

        // Анимация получения урона с использованием tween
        tween(this.node)
            .to(0.1, { scale: v3(1.2, 1.2, 1) })
            .to(0.1, { scale: v3(1, 1, 1) })
            .start();
    }

    public isDead(): boolean {
        return this.currentHealth <= 0;
    }

    public getPoints(): number {
        // Больше очков за более здоровых изоподов
        return this.maxHealth;
    }

    public destroyContainer() {
        this.game['containers'].destroyContainer(this.position);
    }

    private onClick() {
        this.game.onIsopodClicked(this);
    }
}


