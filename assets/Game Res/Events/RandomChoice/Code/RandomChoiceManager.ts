import { _decorator, CCInteger, Component, Node, random } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('RandomChoiceManager')
export class RandomChoiceManager extends Component {

    @property(CCInteger)
    buttonsPressed = 0; 

    @property([Node])
    choices: Node[] = [];

    DestroyChoiceButton(buttonID){
        this.choices[buttonID].destroy();
        this.buttonsPressed++;
    }



    start() {
    }

    update(deltaTime: number) {
    }
}


