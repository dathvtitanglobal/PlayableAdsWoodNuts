import { _decorator, Component, EventTouch, Input, log, macro, Node, screen, sp, Tween, tween, Vec3 } from 'cc';
import playableHelper from './helper/helper';
const { ccclass, property } = _decorator;

@ccclass('SwapMap')
export class SwapMap extends Component {
    @property([Node])
    listMapSwaping: Node[] = []

    @property([Node])
    listPlaceHolder: Node[] = []

    @property(Node)
    listPlaceNodeHolder: Node

    @property(Node)
    hand: Node
    
    private indexMove: number[] = []

    public isSwapping: boolean = false

    defaultScale = Vec3.ONE


    start() {
        log("Swap Map Start Here")
        for(var i=0; i<this.listMapSwaping.length; i++)
        {
            this.indexMove.push(i)
        }

        this.handleOrientation(screen.windowSize.width < screen.windowSize.height? macro.ORIENTATION_PORTRAIT: macro.ORIENTATION_LANDSCAPE)

        this.isSwapping = true
        this.StartSwap()
        this.node.on(Input.EventType.TOUCH_START, this.onTouch, this)
        this.hand.active = false

        screen.on('orientation-change', this.handleOrientation, this);

    }

    update(deltaTime: number) {
        
    }

    handleOrientation(orientation: number)
    {
        if(orientation == macro.ORIENTATION_LANDSCAPE || orientation == macro.ORIENTATION_LANDSCAPE_LEFT || orientation == macro.ORIENTATION_LANDSCAPE_RIGHT)
        {

            this.defaultScale = new Vec3(1, 1, 1)
            
        }
        else if(orientation == macro.ORIENTATION_PORTRAIT || orientation == macro.ORIENTATION_PORTRAIT_UPSIDE_DOWN)
        {

            this.defaultScale = new Vec3(0.8, 0.8, 0.8)
        }

        this.listPlaceNodeHolder.scale = this.defaultScale
    }

    onTouch(event: EventTouch)
    {
        log("Redirect to store")
        playableHelper.redirect()
    }

    private StartSwap()
    {
        log("Start Swap Here")
        if(!this.isSwapping)
        {
            return
        }

        this.hand.active = true
        this.hand.position = new Vec3(100, this.hand.position.y, this.hand.position.z)
        var anim = this.hand.getChildByName("Hand").getComponent(sp.Skeleton).setAnimation(0, "animation", false)
        tween(this.hand).to(anim.animation.duration, {
            position: new Vec3(-100, this.hand.position.y, this.hand.position.z)
        }, {
            onComplete: () => {
                this.hand.active = false
            }
        }).start()

        // tween(this.listMapSwaping[0]).to(1, {
        //     worldPosition: this.listPlaceHolder[this.indexMove[1]].worldPosition
        // }).start()  

        for(var i=0; i<this.listMapSwaping.length; i++)
        {
            if(this.indexMove[i] + 1 >= this.listMapSwaping.length)
            {
                log("Reset Index Here")
                this.indexMove[i] = 0
            }
            else
            {
                this.indexMove[i] += 1
            }

            log("i = ", i)
            log("Index move i", this.indexMove[i])

            //this.listMapSwaping[i].setParent(this.listPlaceHolder[this.indexMove[i]])
            let toScale = this.defaultScale
            if(this.indexMove[i] == 2)
            {
                this.listMapSwaping[i].setSiblingIndex(2)
                toScale = new Vec3(1.1 * toScale.x, 1.1 * toScale.y, 1.1 * toScale.z)
            }

            tween(this.listMapSwaping[i]).to(anim.animation.duration, {
                worldPosition: this.listPlaceHolder[this.indexMove[i]].worldPosition,
                scale: toScale
                
            }).start()  

            
        }

        setTimeout(() => {
            this.StartSwap()
        }, 3000);
    }
}


