import { _decorator, Component, Label, ProgressBar, Button } from 'cc';
import { TransportManager, TransportType } from './TransportManager';

const { ccclass, property } = _decorator;

@ccclass('TransportUI')
export class TransportUI extends Component {
    @property({ type: Label })
    public moneyLabel: Label | null = null;

    @property({ type: Label })
    public capacityLabel: Label | null = null;

    @property({ type: ProgressBar })
    public capacityBar: ProgressBar | null = null;

    @property({ type: Label })
    public transportTypeLabel: Label | null = null;

    @property({ type: Label })
    public islandLevelLabel: Label | null = null;

    @property({ type: Button })
    public dolphinUnlockButton: Button | null = null;

    @property({ type: Button })
    public anglerUnlockButton: Button | null = null;

    private transportManager: TransportManager | null = null;

    protected onLoad(): void {
        this.transportManager = this.node.getComponent(TransportManager) ||
            this.node.scene.getComponentInChildren(TransportManager);

        if (!this.transportManager) {
            console.error('TransportManager not found!');
            return;
        }

        this.updateUI();
    }

    public updateUI(): void {
        if (!this.transportManager) return;

        // Обновляем деньги
        if (this.moneyLabel) {
            this.moneyLabel.string = `$${this.transportManager.getMoney()}`;
        }

        // Обновляем информацию о транспорте
        const transportInfo = this.transportManager.getCurrentTransportInfo();
        if (transportInfo) {
            if (this.capacityLabel) {
                this.capacityLabel.string = `${transportInfo.current.toFixed(1)}/${transportInfo.max}`;
            }

            if (this.capacityBar) {
                this.capacityBar.progress = transportInfo.current / transportInfo.max;
            }

            if (this.transportTypeLabel) {
                this.transportTypeLabel.string = this.getTransportName(transportInfo.type);
            }
        }

        // Обновляем уровень острова
        if (this.islandLevelLabel) {
            this.islandLevelLabel.string = `Уровень острова: ${this.transportManager.getIslandLevel()}`;
        }

        // Обновляем кнопки разблокировки
        this.updateUnlockButtons();
    }

    private getTransportName(type: TransportType): string {
        switch (type) {
            case TransportType.TURTLE: return 'Черепаха';
            case TransportType.DOLPHIN: return 'Дельфин';
            case TransportType.ANGLER: return 'Удильщик';
            default: return 'Неизвестно';
        }
    }

    private updateUnlockButtons(): void {
        // Логика обновления состояния кнопок разблокировки
        // Можно добавить проверки на доступность и стоимость
    }

    // Методы для кнопок
    public switchToTurtle(): void {
        if (this.transportManager?.switchTransport(TransportType.TURTLE)) {
            this.updateUI();
        }
    }

    public switchToDolphin(): void {
        if (this.transportManager?.switchTransport(TransportType.DOLPHIN)) {
            this.updateUI();
        }
    }

    public switchToAngler(): void {
        if (this.transportManager?.switchTransport(TransportType.ANGLER)) {
            this.updateUI();
        }
    }

    public unlockDolphin(): void {
        if (this.transportManager?.unlockTransport(TransportType.DOLPHIN)) {
            this.updateUI();
        }
    }

    public unlockAngler(): void {
        if (this.transportManager?.unlockTransport(TransportType.ANGLER)) {
            this.updateUI();
        }
    }
}