import { _decorator, CCInteger, Component, Node, random } from 'cc';
import { RandomChoiceManager } from './RandomChoiceManager';
import { ResourceManager } from './ResourceManager';
const { ccclass, property } = _decorator;

@ccclass('ChoiceButton')
export class ChoiceButton extends Component {

    @property(CCInteger)
    id = -1;

    @property(ResourceManager)
    resourceManager : ResourceManager;

    @property(RandomChoiceManager)
    buttonsManager : RandomChoiceManager;

    onChoiceButtonClick(){
        if(this.buttonsManager.buttonsPressed != 3){
            this.resourceManager.resurces += Math.round((random() * 100));
            this.buttonsManager.DestroyChoiceButton(this.id);
        }
    }
    
    start() {

    }

    update(deltaTime: number) {
        
    }
}


