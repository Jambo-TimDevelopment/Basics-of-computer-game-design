import { _decorator, Color, Component, Graphics, Node, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("BorderDrawer")
export class BorderDrawer extends Component {
  @property(Color)
  public borderColor: Color = new Color(100, 100, 100);

  @property(Color)
  public fillColor: Color = new Color(255, 255, 255);

  @property({ min: 0 })
  public borderWidth: number = 2;

  @property({ min: 0 })
  public radius: number = 20;

  private graphics: Graphics = null;
  private uiTransform: UITransform = null;

  onLoad() {
    this.graphics = this.getComponent(Graphics);
    this.uiTransform = this.getComponent(UITransform);
    this.draw();
  }

  draw() {
    if (!this.graphics || !this.uiTransform) return;

    const g = this.graphics;
    const width = this.uiTransform.width;
    const height = this.uiTransform.height;
    const x = -width * this.uiTransform.anchorX;
    const y = -height * this.uiTransform.anchorY;

    g.clear();

    // 1. Рисуем внешнюю рамку (border)
    g.fillColor = this.borderColor;
    g.roundRect(x, y, width, height, this.radius);
    g.fill();

    // 2. Рисуем внутренний фон (content), он будет поверх рамки
    const innerRadius = Math.max(0, this.radius - this.borderWidth);
    g.fillColor = this.fillColor;
    g.roundRect(
      x + this.borderWidth,
      y + this.borderWidth,
      width - this.borderWidth * 2,
      height - this.borderWidth * 2,
      innerRadius
    );
    g.fill();
  }
}
