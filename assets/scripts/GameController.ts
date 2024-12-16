import { _decorator, Camera, Component, director, EventMouse, EventTouch, Game, Input, input, instantiate, Label, log, Node, ParticleSystem2D, Prefab, Quat, Skeleton, sp, tween, Vec2, Vec3 } from 'cc';
import { Bolt } from './Bolt';
import { Timber } from './Timber';
import { Hole } from './Hole';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {

    @property(sp.Skeleton)
    handAnim: sp.Skeleton

    @property(Camera)
    canvasCamera: Camera

    @property(Label)
    textIQ: Label

    @property(Node)
    owl: Node

    @property(Node)
    iqNode: Node

    @property(Node)
    textTestYourIQ: Node

    @property(Prefab)
    tapBoltFx: Prefab


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

    start() {
       GameController.instance = this

       this.listTimber = this.getComponentsInChildren(Timber)

       this.listHole = this.getComponentsInChildren(Hole)

       this.listBolt = this.getComponentsInChildren(Bolt)

       this.activeHand(this.listBolt[0].node.worldPosition)

       input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this);

       this.textIQ.string = this.iqNum + ""

       setTimeout(() => {
            this.checkLose()
       }, 10000)
       
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
    }

    public updateIQ(delta: number)
    {
        log("Update IQ Here")
        tween({value: this.iqNum}).to(0.5, {value: this.iqNum + delta}, {
            onUpdate: target => {
                this.iqNum = target.value
                this.textIQ.string = parseInt(this.iqNum + "") + ""
            }
        })
        .start()
    }

    public showIQ()
    {
        if(this.isIQShowed)
        {
            return
        }

        this.isIQShowed = true
        this.textTestYourIQ.active = false
        this.iqNode.active = true
        this.updateIQ(70)
        this.rotateOwl()
    }

    private rotateOwl()
    {
        let leftAngle = new Quat()
        Quat.fromEuler(leftAngle,0, 0, 4)
        let rightAngle = new Quat()
        Quat.fromEuler(rightAngle, 0, 0, -6)
        
        var rotateLeft = tween(this.owl).to(0.5, {
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
        }, 5000)
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
        fx.worldPosition = worldPos
    }

    public screwToHole(hole: Hole, bolt: Bolt)
    {
        log("Screw To Hole")
        this.playTapScrewFx(hole.node.position)
        hole.boltScrewedIn = bolt
        //bolt.node.setParent(hole.node)
        bolt.node.setWorldPosition(hole.node.worldPosition) 
        bolt.playAnimationScrew()
        GameController.instance.setSelectedBolt(null)
        this.updateAllHoleScrew()
        this.checkEnablePhysicAllTimber()

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
        this.handAnim.node.active = true
        this.handAnim.node.worldPosition = pos
        this.handAnim.setAnimation(0, "animation", true)
    }

    public deActiveHand()
    {
        this.handAnim.node.active = false
    }

    public checkAndPerformNextAction()
    {
        let countActiveTimber = 0
        for(var i =0; i<this.listTimber.length; i++)
        {
            if(this.listTimber[i].isActive)
            {
                countActiveTimber ++;
            }
        }

        if(countActiveTimber <= 2)
        {
            log("End game and redirect to store")
            this.isAlwaysRedirectToStore = true
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

    }
}


