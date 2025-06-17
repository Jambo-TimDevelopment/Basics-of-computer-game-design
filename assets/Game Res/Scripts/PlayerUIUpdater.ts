import { _decorator, Component, Node, Label, director } from "cc";
import {
  EVENT_BALANCE_UPDATED,
  EVENT_LEVEL_UPDATED,
  EVENT_NICKNAME_UPDATED,
} from "./PlayerDataManager"; // Импортируем имена событий
const { ccclass, property } = _decorator;

@ccclass("PlayerUIUpdater")
export class PlayerUIUpdater extends Component {
  @property(Label)
  public balanceLabel: Label = null;

  @property(Label)
  public nicknameLabel: Label = null;

  @property(Label)
  public levelLabel: Label = null;

  onEnable() {
    // Подписываемся на события, когда компонент становится активным
    director.on(EVENT_BALANCE_UPDATED, this.updateBalance, this);
    director.on(EVENT_NICKNAME_UPDATED, this.updateNickname, this);
    director.on(EVENT_LEVEL_UPDATED, this.updateLevel, this);

    // Также можно запросить начальные данные здесь, если нужно
    // Но лучше это делать из самого PlayerDataManager, который их устанавливает
  }

  onDisable() {
    director.off(EVENT_BALANCE_UPDATED, this.updateBalance, this);
    director.off(EVENT_NICKNAME_UPDATED, this.updateNickname, this);
    director.off(EVENT_LEVEL_UPDATED, this.updateLevel, this);
  }

  /**
   * Этот метод будет вызван событием EVENT_BALANCE_UPDATED
   * @param newBalance Новое значение баланса, переданное с событием
   */
  private updateBalance(newBalance: number) {
    if (this.balanceLabel) {
      this.balanceLabel.string = newBalance.toString();
    }
  }

  /**
   * Этот метод будет вызван событием EVENT_NICKNAME_UPDATED
   * @param newNickname Новое имя, переданное с событием
   */
  private updateNickname(newNickname: string) {
    if (this.nicknameLabel) {
      this.nicknameLabel.string = newNickname;
    }
  }

  private updateLevel(newLevel: number) {
    if (this.levelLabel) {
      this.levelLabel.string = `LVL. ${newLevel}`;
    }
  }
}
