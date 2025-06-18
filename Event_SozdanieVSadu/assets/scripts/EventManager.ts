import { _decorator, Component, Node, Button, Label, Sprite, Color, SpriteFrame} from 'cc';
const { ccclass, property } = _decorator;

@ccclass('EventManager')
export class EventManager extends Component {
    // UI элементы
    @property(Button)
    private startButton: Button = null!;
    
    @property(Node)
    private eventWindow: Node = null!;
    
    @property(Label)
    private eventText: Label = null!;
    
    @property(Button)
    private firstContinueButton: Button = null!;
    
    @property(Button)
    private finalContinueButton: Button = null!;
    
    @property(Sprite)
    private circleImage: Sprite = null!;
    
    @property([Label])
    private choiceLabels: Label[] = [];
    
    @property(Label)
    private resultText: Label = null!;

    // Спрайты существ
    @property(SpriteFrame)
    private krakenSprite: SpriteFrame = null!;
    
    @property(SpriteFrame)
    private witchSprite: SpriteFrame = null!;
    
    @property(SpriteFrame)
    private spiritSprite: SpriteFrame = null!;
    
    @property(SpriteFrame)
    private entitySprite: SpriteFrame = null!;

        // Данные событий
    private readonly events = [
        {
            id: "shy_kraken",
            title: "Застенчивый кракен-малыш",
            sprite: "krakenSprite",
            description: "Среди зарослей кораллов мелькнуло что-то тёмное.\nВы присматриваетесь, и видите крошечного кракена, прячущегося за камнем.\nЕго огромные глаза светятся в полумраке, а щупальца робко обвивают раковину.\nКажется, он боится вас больше, чем вы его",
            choices: [
                {
                    text: "Приблизиться (осторожно)",
                    outcomes: [
                        { probability: 60, text: "Кракен-малыш доверчиво прикасается щупальцем к вашей руке, затем роняет «Жемчужину детского восторга» (+200% к скорости роста на 12 часов).", isPositive: true },
                        { probability: 25, text: "Он пугается и в панике хватает первый попавшийся предмет из вашего инвентаря («Украл коралловый нож!»).", isPositive: false },
                        { probability: 15, text: "Он радостно обвивает вашу руку, и все растения в саду вдруг расцветают (мгновенное созревание).", isPositive: true }
                    ]
                },
                {
                    text: "Спросить: «Кто ты?»",
                    outcomes: [
                        { probability: 50, text: "Он жестами показывает, где спрятан сундук с «Щупальцевыми фруктами» (открывает скрытую локацию).", isPositive: true },
                        { probability: 30, text: "Он рисует в воде загадку: «Что исчезает, если назвать его имя?» (Ответ: Тишина → даёт «Пузырь мудрости»).", isPositive: false },
                        { probability: 20, text: "Он пугается и выпускает чернила — сад покрывается тенью (-20% скорости роста на сутки).", isPositive: false }
                    ]
                },
                {
                    text: "Прогнать",
                    outcomes: [
                        { probability: 50, text: "Он обиженно швыряет в вас ракушкой → 3 случайных растения вянут.", isPositive: false },
                        { probability: 40, text: "В панике он опрокидывает ваши удобрения («Все полезные вещества уплыли!»).", isPositive: false },
                        { probability: 10, text: "Внезапно он улыбается (оказывается, это был тест) и даёт «Зуб тритона» (+15% к скорости роста).", isPositive: true }
                    ]
                },
                {
                    text: "Уйти",
                    outcomes: [
                        { probability: 80, text: "Он просто продолжает играть с ракушками.", isPositive: true },
                        { probability: 20, text: "Он решает, что вы его презираете → следующий урожай будет на 30% меньше.", isPositive: false }
                    ]
                }
            ]
        },
        {
            id: "sea_witch",
            title: "Злобная морская ведьма",
            sprite: "witchSprite",
            description: "Водоросли внезапно расступились, и перед вами возникла высокая фигура с кожей, покрытой чешуёй.\nЕё волосы — это живые змеи, а в руках она сжимает посох из костей.\n«Кто посмел потревожить мой покой?» — раздаётся в вашей голове голос, полный яда.",
            choices: [
                {
                    text: "Приблизиться (осторожно)",
                    outcomes: [
                        { probability: 30, text: "Она снисходительно кивает и бросает вам «Сердце медузы» (ускоряет рост ночью на 400%).", isPositive: true },
                        { probability: 50, text: "Её змеи-волосы шипят и вырывают из сумки 2 случайных предмета.", isPositive: false },
                        { probability: 20, text: "Она насмехается, но в гневе «благословляет» сад (всё созревает, но растения теперь колючие).", isPositive: false }
                    ]
                },
                {
                    text: "Спросить: «Кто ты?»",
                    outcomes: [
                        { probability: 30, text: "Она указывает на затонувший алтарь (метка на карте).", isPositive: true },
                        { probability: 40, text: "«Что можно разбить, даже не касаясь?» (Ответ: Обещание → даёт «Клык морского дьявола»).", isPositive: true },
                        { probability: 30, text: "Она проклинает воду — рост замедляется на 48 часов.", isPositive: false }
                    ]
                },
                {
                    text: "Прогнать",
                    outcomes: [
                        { probability: 70, text: "Она насылает ядовитые водоросли → уничтожает 50% урожая.", isPositive: false },
                        { probability: 20, text: "Ведьма в ярости ворует все удобрения.", isPositive: false },
                        { probability: 10, text: "Она уважает вашу дерзость и даёт «Глаз хаоса» (удваивает урожай, но 10% растений мутируют).", isPositive: true }
                    ]
                },
                {
                    text: "Уйти",
                    outcomes: [
                        { probability: 60, text: "Она не считает вас достойным внимания.", isPositive: true },
                        { probability: 40, text: "Она наслала медуз → следующие 3 урожая будут скудными.", isPositive: false }
                    ]
                }
            ]
        },
        {
            id: "sea_spirit",
            title: "Древний морской дух",
            sprite: "spiritSprite",
            description: "Перед вами материализуется полупрозрачная фигура, сотканная из света и воды.\nЕё черты меняются, как волны, а глаза — словно две луны, смотрящие из глубины.\n«Ты пришёл в мой сад…» — звучит эхо, обволакивая ваш разум.",
            choices: [
                {
                    text: "Приблизиться (осторожно)",
                    outcomes: [
                        { probability: 40, text: "Он оставляет «Слёзы океана» (удобрение для легендарных растений).", isPositive: true },
                        { probability: 40, text: "Ваш инвентарь временно исчезает (возвращается через 10 минут).", isPositive: false },
                        { probability: 20, text: "Он касается сада — все растения эволюционируют (дают +1 уровень качества).", isPositive: true }
                    ]
                },
                {
                    text: "Спросить: «Кто ты?»",
                    outcomes: [
                        { probability: 50, text: "Он показывает «Путь к Атлантиде» (разблокирует скрытый уровень).", isPositive: true },
                        { probability: 30, text: "«Что принадлежит тебе, но другие используют чаще?» (Ответ: Имя → даёт «Песочные часы Посейдона»).", isPositive: true },
                        { probability: 20, text: "Он исчезает, и вода становится «тяжёлой» (рост -50% на сутки).", isPositive: false }
                    ]
                },
                {
                    text: "Прогнать",
                    outcomes: [
                        { probability: 50, text: "Приливная волна сносит 30% грядок.", isPositive: false },
                        { probability: 40, text: "Все удобрения растворяются в воде.", isPositive: false },
                        { probability: 10, text: "Дух смеётся и даёт «Трезубец малого прилива» (+25% к скорости роста).", isPositive: true }
                    ]
                },
                {
                    text: "Уйти",
                    outcomes: [
                        { probability: 90, text: "Он не препятствует вам.", isPositive: true },
                        { probability: 10, text: "Он забирает часть ваших сил → следующий урожай гниёт на корню.", isPositive: false }
                    ]
                }
            ]
        },
        {
            id: "abyssal_entity",
            title: "Подводное нечто",
            sprite: "entitySprite",
            description: "Что-то шевелится в тени.\nВы не можете разглядеть его полностью — лишь обрывки форм: то ли щупальца, то ли плавники, то ли что-то совсем иное.\nОно наблюдает. Оно ждёт.\nВаша кожа покрывается мурашками, хотя в воде и не может быть мурашек.",
            choices: [
                {
                    text: "Приблизиться (осторожно)",
                    outcomes: [
                        { probability: 20, text: "Оно дарит вам «Кость Левиафана» (удобрение для монструозных растений).", isPositive: true },
                        { probability: 60, text: "Что-то щупальцевое выхватывает 3 случайных предмета и исчезает.", isPositive: false },
                        { probability: 20, text: "Оно «играет» с садом — все растения перемешиваются (рандомные эффекты).", isPositive: false }
                    ]
                },
                {
                    text: "Спросить: «Кто ты?»",
                    outcomes: [
                        { probability: 30, text: "В вашей карте появляются новые отметки (но они могут быть ловушками).", isPositive: false },
                        { probability: 40, text: "«Что ты никогда не увидишь, но всегда будешь бояться?» (Ответ: Завтра → даёт «Тень бездны»).", isPositive: true },
                        { probability: 30, text: "Оно шепчет — вода темнеет (рост останавливается на 12 часов).", isPositive: false }
                    ]
                },
                {
                    text: "Прогнать",
                    outcomes: [
                        { probability: 80, text: "Оно взрывается чернилами → уничтожает 70% сада.", isPositive: false },
                        { probability: 15, text: "Все удобрения превращаются в ил.", isPositive: false },
                        { probability: 5, text: "Оно оставляет после себя «Зуб Ктулху» (+50% к скорости, но растения теперь шевелятся).", isPositive: true }
                    ]
                },
                {
                    text: "Уйти",
                    outcomes: [
                        { probability: 50, text: "Оно теряет к вам интерес.", isPositive: true },
                        { probability: 50, text: "Оно следует за вами → следующие 5 урожаев будут «странными» (например, рыбы вместо фруктов).", isPositive: false }
                    ]
                }
            ]
        }
    ];

    private currentEventIndex: number = 0;
    
    onLoad() {
        this.setupStyles();
        this.makeButtonInvisible(this.startButton);
        
        this.startButton.node.on(Button.EventType.CLICK, this.startEvent, this);
        this.firstContinueButton.node.on(Button.EventType.CLICK, this.showChoices, this);
        this.finalContinueButton.node.on(Button.EventType.CLICK, this.closeEvent, this);
        
        this.resetUI();
    }
    
    private setupStyles() {
        // Установка шрифта Cormorant Infant
        this.eventText.fontFamily = "Cormorant Infant";
        this.resultText.fontFamily = "Cormorant Infant";
        this.choiceLabels.forEach(label => label.fontFamily = "Cormorant Infant");
    }
    
    private makeButtonInvisible(button: Button) {
        const buttonSprite = button.getComponent(Sprite);
        if (buttonSprite) {
            buttonSprite.color = new Color(0, 0, 0, 0);
        }
        button.transition = Button.Transition.NONE;
    }
    
    private resetUI() {
        this.eventWindow.active = false;
        this.circleImage.node.active = false;
        this.firstContinueButton.node.active = false;
        this.finalContinueButton.node.active = false;
        this.choiceLabels.forEach(label => label.node.active = false);
        this.resultText.node.active = false;
        this.startButton.node.active = true;
    }
    
    startEvent() {
        this.currentEventIndex = Math.floor(Math.random() * this.events.length);
        const event = this.events[this.currentEventIndex];
        
        this.eventText.string = event.description;
        this.eventText.node.active = true;
        this.firstContinueButton.node.active = true;
        
        this.startButton.node.active = false;
        this.eventWindow.active = true;
    }
    
    showChoices() {
        const event = this.events[this.currentEventIndex];
        
        // Устанавливаем изображение существа
        this.setCreatureImage(event.sprite);
        
        this.eventText.node.active = false;
        this.firstContinueButton.node.active = false;
        this.circleImage.node.active = true;
        
        // Показываем варианты выбора
        event.choices.forEach((choice, index) => {
            const label = this.choiceLabels[index];
            label.string = choice.text;
            label.node.active = true;
            
            label.node.off(Node.EventType.TOUCH_END);
            label.node.on(Node.EventType.TOUCH_END, () => this.showOutcome(index), this);
        });
    }

    private setCreatureImage(spriteProperty: string) {
        switch(spriteProperty) {
            case "krakenSprite":
                this.circleImage.spriteFrame = this.krakenSprite;
                break;
            case "witchSprite":
                this.circleImage.spriteFrame = this.witchSprite;
                break;
            case "spiritSprite":
                this.circleImage.spriteFrame = this.spiritSprite;
                break;
            case "entitySprite":
                this.circleImage.spriteFrame = this.entitySprite;
                break;
            default:
                console.warn("Unknown sprite property:", spriteProperty);
        }
    }
    
    showOutcome(choiceIndex: number) {
        const event = this.events[this.currentEventIndex];
        const choice = event.choices[choiceIndex];
        
        // Выбираем исход на основе вероятностей
        const random = Math.random() * 100;
        let cumulativeProbability = 0;
        let selectedOutcome = choice.outcomes[0];
        
        for (const outcome of choice.outcomes) {
            cumulativeProbability += outcome.probability;
            if (random <= cumulativeProbability) {
                selectedOutcome = outcome;
                break;
            }
        }
        
        // Показываем результат
        this.choiceLabels.forEach(label => label.node.active = false);
        this.circleImage.node.active = false;
        
        this.resultText.string = selectedOutcome.text;
        this.resultText.node.active = true;
        this.finalContinueButton.node.active = true;
        
        // Можно добавить визуальные эффекты в зависимости от isPositive
    }
    
    closeEvent() {
        this.resetUI();
    }
}