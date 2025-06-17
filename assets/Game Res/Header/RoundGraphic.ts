import { _decorator, Color, Component, Graphics, Node, UITransform } from "cc";
const { ccclass, property } = _decorator;

@ccclass("RoundGraphic")
export class RoundGraphic extends Component {
  @property
  public cornerRadius = 15;

  @property
  public rectColor: Color = new Color(100, 100, 255, 255);

  start() {
    const graphics = this.getComponent(Graphics);
    const uiTransform = this.getComponent(UITransform);

    if (!graphics || !uiTransform) {
      return;
    }

    const width = uiTransform.width;
    const height = uiTransform.height;

    // The drawing origin (0,0) is the node's anchor point.
    // To draw centered, we must offset by half the width/height.
    const x = -width * uiTransform.anchorX;
    const y = -height * uiTransform.anchorY;

    // Clear previous drawings
    graphics.clear();

    // Set the fill color
    graphics.fillColor = this.rectColor;

    // Draw the rounded rectangle
    graphics.roundRect(x, y, width, height, this.cornerRadius);

    // Execute the drawing
    graphics.fill();

    // Optional: to add an outline
    // graphics.strokeColor = Color.BLACK;
    // graphics.lineWidth = 5;
    // graphics.stroke();
  }

  update(deltaTime: number) {}
}
