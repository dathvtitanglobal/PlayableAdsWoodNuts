import { _decorator, Camera, Component, director, EventMouse, EventTouch, game, Game, Input, input, instantiate, Label, log, macro, Node, ParticleSystem2D, PhysicsSystem2D, Prefab, Quat, Skeleton, sp, Tween, tween, Vec2, Vec3, Widget } from 'cc';
import { screen as ccScreen } from 'cc';
import { Bolt } from './Bolt';
import { Timber } from './Timber';
import { Hole } from './Hole';
import super_html_playable from './super_html_playable';
import playableHelper from './helper/helper';
const { ccclass, property } = _decorator;


@ccclass('GameController')
export class GameController extends Component {

    @property(Number)
    horizontalCenterOffset: Number = 0

    @property(Number)
    verticalCenterOffset: Number = 0

    @property(Node)
    handAnim: Node

    @property(Camera)
    canvasCamera: Camera

    @property(Label)
    textIQ: Label

    @property(Label)
    textIQPortrait: Label

    @property(Node)
    owl: Node

    @property(Node)
    owlPortrait: Node

    @property(Node)
    iqNode: Node

    @property(Node)
    iqNodePortrait: Node

    @property(Node)
    textTestYourIQ: Node

    @property(Node)
    textTestYourIQPortrait: Node

    @property(Prefab)
    tapBoltFx: Prefab

    @property(Node)
    portraitUI: Node

    @property(Node)
    landscapeUI: Node

    @property(Node)
    gameBoard: Node

    @property(Node)
    bonusScore: Node


    public static instance: GameController

    private currentBoltSelected: Bolt = null

    public lastHoleUnScrewed: Hole

    public listTimber: Timber[]

    public listHole: Hole[]

    public listBolt: Bolt[]

    public isAlwaysRedirectToStore = false;

    public deltaDistance = 10

    public timeCoolDownShowGuide = 15

    private iqNum = 0

    private isIQShowed = false

    private portraitScale = Vec3.ONE

    private tweenUpdate: Tween<Node>

    start() {

        // super_html_playable.game_start();

        // super_html_playable.game_ready()

        playableHelper.gameStart()

        GameController.instance = this

        this.portraitScale = this.gameBoard.scale

        this.listTimber = this.getAllComponentsInChildren(this.node, Timber)

        this.listHole = this.getAllComponentsInChildren(this.node, Hole)

        this.listBolt = this.getAllComponentsInChildren(this.node, Bolt)

        //input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);

        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this)

        this.textIQ.string = this.iqNum + ""
        this.textIQPortrait.string = this.iqNum + ""

        setTimeout(() => {
                this.checkLose()
        }, 10000)

        this.handleOrientation(ccScreen.windowSize.width < ccScreen.windowSize.height? macro.ORIENTATION_PORTRAIT: macro.ORIENTATION_LANDSCAPE)

        setTimeout(() => {
            this.activeHand(this.listBolt[0].node.worldPosition)
        }, 1000)


        // screen.orientation.addEventListener("change", (event) => {
        //     log("Orientation change here")
        //     this.handleOrientation()
        // });
        
        ccScreen.on('orientation-change', this.handleOrientation, this);

    //    window.addEventListener("orientationchange", function() {
    //         log("Orientation change here")
    //         //this.enableTimbersPhysic(false)
    //         this.handleOrientation()
    //         // this.enableTimbersPhysic(true)
    //         // this.handleOrientation()

    //         // setTimeout(() => {
    //         //     this.enableTimbersPhysic(true)
                
    //         // }, 1000)
    //     }.bind(this) )
       
    }
    

    
    update(deltaTime: number) {
        if(this.timeCoolDownShowGuide <= 0)
        {
            this.activeHand(this.listBolt[0].node.worldPosition)
            this.resetTimeCoolDownShowGuide()
        }
        else
        {
            this.timeCoolDownShowGuide -= deltaTime
        }

        // log("Window width: ", window.screen.width)
        // log("Window orient: ", window.screen.orientation.type)
        // log("Window angle:" +window.screen.orientation.angle)
    }

    getAllComponentsInChildren<T extends Component>(
        parent: Node,
        componentType?: { new (): T } // Optional filter by component type
    ): T[] {
        const components: T[] = [];
    
        // Helper function for recursion
        function traverse(node: Node): void {
            if (!node) return;
    
            // If a component type is specified, get only that type
            if (componentType) {
                const foundComponents = node.getComponents(componentType);
                components.push(...foundComponents);
            } else {
                // If no type is specified, get all components
                const foundComponents = node.getComponents(Component) as T[];
                components.push(...foundComponents);
            }
    
            // Recurse into children
            node.children.forEach((child) => traverse(child));
        }
    
        // Start recursion from the parent node
        traverse(parent);
    
        return components;
    }

    handleOrientation(orientation: number)
    {
        log("Orientation type: ", orientation)

        if(orientation == macro.ORIENTATION_LANDSCAPE || orientation == macro.ORIENTATION_LANDSCAPE_LEFT || orientation == macro.ORIENTATION_LANDSCAPE_RIGHT)
        {
            this.portraitUI.active = false
            this.landscapeUI.active = true
            this.gameBoard.getComponent(Widget).horizontalCenter = this.horizontalCenterOffset.valueOf()
            this.gameBoard.getComponent(Widget).verticalCenter = 0
            //this.gameBoard.setScale(this.portraitScale)
            // if((screen.orientation.angle / 90) % 2 == 0){
            //     this.portraitUI.active = false
            //     this.landscapeUI.active = true
            //     this.gameBoard.getComponent(Widget).horizontalCenter = -261
            //     this.gameBoard.getComponent(Widget).verticalCenter = 0
            //     this.gameBoard.setScale(Vec3.ONE)
            // }
            // else
            // {
            //     this.portraitUI.active = true
            //     this.landscapeUI.active = false
            //     this.gameBoard.getComponent(Widget).horizontalCenter = 0
            //     this.gameBoard.getComponent(Widget).verticalCenter = -83
            //     this.gameBoard.setScale(new Vec3(1.7, 1.7, 1.7))
            // }
        }
        else if(orientation == macro.ORIENTATION_PORTRAIT || orientation == macro.ORIENTATION_PORTRAIT_UPSIDE_DOWN)
        {
            this.portraitUI.active = true
            this.landscapeUI.active = false
            this.gameBoard.getComponent(Widget).horizontalCenter = 0
            this.gameBoard.getComponent(Widget).verticalCenter = this.verticalCenterOffset.valueOf()
            //this.gameBoard.setScale(new Vec3(0.8, 0.8))
            // if((screen.orientation.angle / 90) % 2 == 0){
            //     this.portraitUI.active = true
            //     this.landscapeUI.active = false
            //     this.gameBoard.getComponent(Widget).horizontalCenter = 0
            //     this.gameBoard.getComponent(Widget).verticalCenter = -83
            //     this.gameBoard.setScale(new Vec3(1.7, 1.7, 1.7))
            // }
            // else
            // {
            //     this.portraitUI.active = false
            //     this.landscapeUI.active = true
            //     this.gameBoard.getComponent(Widget).horizontalCenter = -261
            //     this.gameBoard.getComponent(Widget).verticalCenter = 0
            //     this.gameBoard.setScale(Vec3.ONE)
            // }
        }
    }


    public updateIQ(delta: number)
    {
        log("Update IQ Here")
        var tempIQ = this.iqNum
        this.textIQ.string = parseInt(tempIQ + "") + ""
        this.textIQPortrait.string = parseInt(tempIQ + "") + ""
        this.iqNum += delta

        var target = new Vec3()

        if(delta <= 5)
        {
            if(this.tweenUpdate != null)
            {
                this.tweenUpdate.stop();
                this.tweenUpdate = null
            }

            this.bonusScore.scale = new Vec3(2, 2, 2)
            this.bonusScore.position = Vec3.ZERO
            this.tweenUpdate = tween(this.bonusScore).to(0.5, {
                scale: Vec3.ONE
            }, {onComplete: () => {
                tween({value: tempIQ}).to(0.5, {value: this.iqNum}, {
                    onUpdate: target => {
                        tempIQ = target.value
                        this.textIQ.string = parseInt(tempIQ + "") + ""
                        this.textIQPortrait.string = parseInt(tempIQ + "") + ""
                    }
                }).start()
            }})
            .to(0.2, {
                position: this.handAnim.parent.inverseTransformPoint(target, this.textIQ.node.activeInHierarchy? this.textIQ.node.worldPosition: this.textIQPortrait.node.worldPosition),
                scale: Vec3.ZERO
            })
            .start()

            
        }
        else
        {
            tween({value: tempIQ}).to(0.5, {value: this.iqNum}, {
                onUpdate: target => {
                    tempIQ = target.value
                    this.textIQ.string = parseInt(tempIQ + "") + ""
                    this.textIQPortrait.string = parseInt(tempIQ + "") + ""
                }
            }).start()
        }
    }

    public showIQ()
    {
        if(this.isIQShowed)
        {
            return
        }

        this.isIQShowed = true
        this.textTestYourIQ.active = false
        this.textTestYourIQPortrait.active = false
        this.iqNode.active = true
        this.iqNodePortrait.active = true
        this.updateIQ(70)
        this.rotateOwl()
    }

    private rotateOwl()
    {
        let leftAngle = new Quat()
        Quat.fromEuler(leftAngle,0, 0, 4)
        let rightAngle = new Quat()
        Quat.fromEuler(rightAngle, 0, 0, -6)
        
        tween(this.owl).to(0.5, {
            rotation: leftAngle
        })
        .to(0.5, {
            rotation: rightAngle
        })
        .to(0.5, {
            rotation: Quat.IDENTITY
        })
        .start()

        tween(this.owlPortrait).to(0.5, {
            rotation: leftAngle
        })
        .to(0.5, {
            rotation: rightAngle
        })
        .to(0.5, {
            rotation: Quat.IDENTITY
        })
        .start()

        setTimeout(() => {
            this.rotateOwl()
        }, 3000)
    }

    onTouchStart(event: EventTouch)
    {
        if(this.isAlwaysRedirectToStore)
        {
            playableHelper.redirect()
            return
        }

        const location = event.getLocation(); // Get mouse position in screen space
        const worldPosition = this.canvasCamera.screenToWorld(location.toVec3());
        log("Pos touch: ", worldPosition)
        var hole = this.getHoleAtPos(worldPosition)
        if(hole != null)
        {
            log("Touch Hole here")
            this.deActiveHand()
            hole.onTouch()
        }
    }

    onMouseUp(event: EventMouse) {
        const location = event.getLocation(); // Get mouse position in screen space
        const worldPosition = this.canvasCamera.screenToWorld(location.toVec3());
        log("Pos touch: ", worldPosition)
        var hole = this.getHoleAtPos(worldPosition)
        if(hole != null)
        {
            log("Touch Hole here")
            hole.onTouch()
        }
    }

    public resetTimeCoolDownShowGuide()
    {
        this.timeCoolDownShowGuide = 15
    }

    public setSelectedBolt(newBoltSelected: Bolt)
    {
        if(newBoltSelected != this.currentBoltSelected)
        {
            if(this.currentBoltSelected != null)
            {
                this.currentBoltSelected.playAnimationScrew()
            }

            if(newBoltSelected != null)
            {
                newBoltSelected.playAnimationUnScrew()
            }   
            this.currentBoltSelected = newBoltSelected
        }
        else
        {
            if(this.currentBoltSelected != null)
            {
                this.currentBoltSelected.playAnimationScrew()
            }
            this.currentBoltSelected = null
        }
    }

    public checkEnablePhysicAllTimber()
    {
        for(let i =0; i<this.listTimber.length; i++)
        {
            this.listTimber[i].checkEnablePhysic()
        }
    }

    public getSelectedBolt(): Bolt
    {
        return this.currentBoltSelected
    }

    public playTapScrewFx(worldPos: Vec3)
    {
        log("Fx Bolt here")
        var fx = instantiate(this.tapBoltFx)
        fx.parent = this.node
        let scale = Vec3.ONE
        //var scale = new Vec3(GameController.instance.listBolt[0].node.scale.x * this.gameBoard.scale.x, GameController.instance.listBolt[0].node.scale.y * this.gameBoard.scale.y, 1)
        
        fx.scale = scale
        fx.worldPosition = worldPos
    }

    public screwToHole(hole: Hole, bolt: Bolt)
    {
        log("Screw To Hole")
        this.playTapScrewFx(hole.node.worldPosition)
        //hole.boltScrewedIn = bolt
        //bolt.node.setParent(hole.node)
        bolt.node.worldPosition = hole.node.worldPosition
        bolt.playAnimationScrew()
        GameController.instance.setSelectedBolt(null)
        this.updateAllHoleScrew()

        this.checkEnablePhysicAllTimber()
        // setTimeout(() => {
        //     this.updateAllHoleScrew()
        //     this.checkEnablePhysicAllTimber()
        // }, 2000)
    }

    public unscrewFromHole(hole: Hole, bolt: Bolt)
    {
        if(hole != null)
        {
            hole.boltScrewedIn = null
            this.lastHoleUnScrewed = hole
        }

        if(bolt != null)
        {
            bolt.holeScrewedIn = null
        }
    }

    public checkLose()
    {
        log("Check lose here")
        var lose = true
        for(var i = 0; i<this.listHole.length; i++)
        {
            var hole = this.listHole[i]
            if(hole.canScrew())
            {
                log("Hole can screw: ", hole.node.name)
                lose = false 
            }
        }

        if(lose)
        {
            playableHelper.gameEnd()
            director.loadScene("LoseScene")
        }
        else
        {
            setTimeout(() => {
                this.checkLose()
            }, 10000)
        }
        
    }

    public updateAllHoleScrew()
    {
        for(var i=0; i<this.listHole.length; i++)
        {
            this.listHole[i].updateBoltScrewIn()
        }
    }

    public activeHand(pos: Vec3)
    {
        this.handAnim.active = true
        
        this.handAnim.worldPosition = pos
        var track = this.handAnim.getChildByName("Hand").getComponent(sp.Skeleton).setAnimation(0, "animation", true) 
        //this.loopBoltFx(pos, track.animation.duration)
    }

    private loopBoltFx(pos: Vec3, duration: number)
    {
        log("Loop here")
        this.playTapScrewFx(pos)
        if(this.handAnim.active)
        {
            setTimeout(() => {
                this.loopBoltFx(pos, duration)
            }, duration * 1000)
        }
    }

    public deActiveHand()
    {
        this.handAnim.active = false
    }

    public checkAndPerformNextAction()
    {
        let countActiveTimber = 0
        for(var i =0; i<this.listTimber.length; i++)
        {
            if(this.listTimber[i].countBoltScrewedIn() >= 1)
            {
                countActiveTimber ++;
            }
        }

        if(countActiveTimber <= 2)
        {
            log("End game and redirect to store")
            super_html_playable.game_end()
            this.isAlwaysRedirectToStore = true
            playableHelper.gameEnd()
            this.redirectToStore()
        }
    }

    public getBoltAtPos(worldPos: Vec3): Bolt
    {
        for(var i = 0; i<this.listBolt.length; i++)
        {
            var distance = Vec2.distance(this.listBolt[i].node.worldPosition, worldPos)
            //log("Distance to bolt: ", distance)
            if(distance < this.deltaDistance)
            {
                return this.listBolt[i]
            }
        }
        return null
    }

    public getHoleOnBoardAtPos(worldPos: Vec3):Hole
    {
        for(var i =0; i<this.listHole.length; i++)
        {
            var hole = this.listHole[i]
            if(!hole.isHoleOnTimber && Vec2.distance(hole.node.worldPosition, worldPos) < this.deltaDistance)
            {
                return hole
            }
        }

        return null
    }

    public getHoleAtPos(worldPos: Vec3)
    {
        for(var i =0; i<this.listHole.length; i++)
        {
            var hole = this.listHole[i]
            if(Vec2.distance(hole.node.worldPosition, worldPos) < this.deltaDistance * 2)
            {
                return hole
            }
        }

        return null
    }

    public redirectToStore()
    {
        this.on_click_download()
        playableHelper.redirect()
    }

    onLoad(): void {
        const androidUrl = "https://play.google.com/store/apps/details?id=ttg.woodscrew.puzzle.wood.nuts.bolts";
        const iosUrl = "";
        super_html_playable.set_google_play_url(androidUrl);
        super_html_playable.set_app_store_url(iosUrl);


        playableHelper.setStoreUrl(iosUrl, androidUrl)

        //window.
    }

    on_click_game_end() {
        super_html_playable.game_end();
    }

    on_click_download() {
        super_html_playable.download();
        super_html_playable.game_end();
    }

    
}


