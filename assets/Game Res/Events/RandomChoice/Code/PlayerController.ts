import { _decorator, Button, CCInteger, Component, math, Node, Sprite, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PlayerController')
export class PlayerController extends Component {

    @property(CCInteger)
    direction = 0;

    @property(Button)
    left : Button

    @property(Button)
    right : Button

    @property(Sprite)
    player : Sprite

    xOffsetRight : math.Vec3 = new Vec3(3, 0, 0);
    xOffsetLeft : math.Vec3 = new Vec3(-3, 0, 0);

    start() {
        this.left.node.on(Node.EventType.TOUCH_START , this.onLeftButtonClick, this);
        this.right.node.on(Node.EventType.TOUCH_START , this.onRightButtonClick, this);
        this.left.node.on(Node.EventType.TOUCH_END, this.onEndClick, this);
        this.right.node.on(Node.EventType.TOUCH_END, this.onEndClick, this);
    }

    update(deltaTime: number) {     
        if(this.direction == 1){
            const newPos = this.player.node.position.add(this.xOffsetRight);
            this.player.node.setPosition(newPos);
            //console.log(this.player.node.position.x);

        }else if(this.direction == -1){
            const newPos = this.player.node.position.add(this.xOffsetLeft);
            this.player.node.setPosition(newPos);
            //console.log(this.player.node.position.x);

        }  
    }

    onLeftButtonClick(){
        this.direction = -1;
    }

    onRightButtonClick(){
        this.direction = 1;
    }

    onEndClick(){
        this.direction = 0;
    }
}


