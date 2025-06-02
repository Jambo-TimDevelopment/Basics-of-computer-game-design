import { _decorator, Collider2D, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Aquaman')
export class Aquaman extends Component {



    start() {
        let collision = this.getComponent(Collider2D);
        if(collision){
            collision.node.on('onCollisionEnter2D', this.onCollision, this);
            // collision.node.on('fire', function () {
            //     console.log("fire in the hole");
            // }, this);
            console.log("!!!!!!!!!");

            //collision.node.on
        }
    }

    onCollision(selfCollider: Collider2D, otherCollider: Collider2D){
        console.log("!!!!!!!!!");
    }

    update(deltaTime: number) {
        
    }
}


