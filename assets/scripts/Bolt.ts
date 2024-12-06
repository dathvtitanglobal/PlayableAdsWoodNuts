import { _decorator, Collider2D, Component, Contact2DType, director, EventTouch, Input, IPhysics2DContact, log, Node, SkeletalAnimation, Skeleton, sp } from 'cc';
import { GameController } from './GameController';
import { Hole } from './Hole';
const { ccclass, property } = _decorator;

@ccclass("Bolt")
export class Bolt extends Component {

    @property(sp.Skeleton)
    boltAnim: sp.Skeleton

    @property(Node)
    public holeScrewedIn: Hole

    public isScrew: boolean = true
    
    start() {
        log("Bolt Start Here")
        this.playAnimationScrew()
        this.node.on(Input.EventType.MOUSE_UP, this.onTouch, this)
        
        //this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        console.log('Collision started with:', otherCollider.node.name);
    }

    update(deltaTime: number) {
        
    }

    onTouch(event: EventTouch)
    {
        log("Bolt Touch here")
        GameController.instance.setSelectedBolt(this)
    }

    public playAnimationScrew(callback: () => void = null)
    {
        this.isScrew = true
        let trackEntry = this.boltAnim.setAnimation(0,"4close", false);
        this.boltAnim.addAnimation(0, "1idleClose", true, 0)
        GameController.instance.checkEnablePhysicAllTimber()
        // trackEntry.listener.end = (entry: sp.spine.TrackEntry) => 
        // {
        //     if (entry.animation.name === "4close") {
        //         callback?.();
        //     }
        // }
    }

    public playAnimationUnScrew(callback: () => void = null)
    {
        this.isScrew = false
        let trackEntry = this.boltAnim.setAnimation(0, "2open", false)
        this.boltAnim.addAnimation(0, "3idleOpen", true, 0)
        // trackEntry.listener.end = (entry: sp.spine.TrackEntry) => {
        //     if(entry.animation.name == "2open")
        //     {
        //         callback?.()
        //     }
        // }
    }
}


