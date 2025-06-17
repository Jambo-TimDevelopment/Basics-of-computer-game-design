import { _decorator, Component, director, Node, sys } from "cc";
const { ccclass } = _decorator;

export interface PlayerData {
  nickname: string;
  balance: number;
  level: number;
}

// Ключ для хранения в localStorage
const STORAGE_KEY = "playerData";

// Имена событий, которые мы будем рассылать
export const EVENT_BALANCE_UPDATED = "balance-updated";
export const EVENT_NICKNAME_UPDATED = "nickname-updated";
export const EVENT_LEVEL_UPDATED = "level-updated";

@ccclass("PlayerDataManager")
export class PlayerDataManager extends Component {
  private data: PlayerData = null;

  onLoad() {
    // Делаем этот узел постоянным, чтобы он не удалялся при смене сцен
    director.addPersistRootNode(this.node);
    this.load();
  }

  // --- Методы для работы с данными ---

  public getBalance(): number {
    return this.data.balance;
  }

  public getNickname(): string {
    return this.data.nickname;
  }

  public getLevel(): number {
    return this.data.level;
  }

  /**
   * Изменяет баланс, сохраняет его и оповещает подписчиков
   */
  public setBalance(newBalance: number) {
    if (this.data.balance === newBalance) return; // Не делаем ничего, если значение не изменилось

    this.data.balance = newBalance;
    console.log(`Баланс изменен на: ${newBalance}`);

    this.save();

    // Оповещаем всю игру о том, что баланс изменился, и передаем новое значение
    director.emit(EVENT_BALANCE_UPDATED, this.data.balance);
  }

  /**
   * Изменяет никнейм, сохраняет его и оповещает подписчиков
   */
  public setNickname(newNickname: string) {
    if (this.data.nickname === newNickname) return;

    this.data.nickname = newNickname;
    console.log(`Никнейм изменен на: ${newNickname}`);

    this.save();

    // Оповещаем об изменении никнейма
    director.emit(EVENT_NICKNAME_UPDATED, this.data.nickname);
  }

  public setLevel(level: number) {
    this.data.level = level;
    console.log(`Уровень изменен на: ${level}`);
    this.save();

    director.emit(EVENT_LEVEL_UPDATED);
  }

  // --- Загрузка и сохранение ---

  private load() {
    const dataString = sys.localStorage.getItem(STORAGE_KEY);
    if (dataString) {
      this.data = JSON.parse(dataString);
      console.log("Данные игрока загружены:", this.data);
    } else {
      // Если данных нет, создаем дефолтные
      console.log("Данные не найдены. Создаются дефолтные.");
      this.data = {
        nickname: "BibaAndBoba",
        balance: 1000,
        level: 1,
      };
      this.save();
    }
  }

  private save() {
    sys.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }
}
