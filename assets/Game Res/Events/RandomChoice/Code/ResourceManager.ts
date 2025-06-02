import { _decorator, CCInteger, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ResourceManager')
export class ResourceManager extends Component {
    
    @property(CCInteger)
    resurces = 0;
    
    start() {

    }

    update(deltaTime: number) {
        
    }
}


