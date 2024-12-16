import { _decorator, AudioClip, Collider2D, Component, Contact2DType, director, EventTouch, Input, IPhysics2DContact, log, Node, Quat, SkeletalAnimation, Skeleton, sp, Vec3 } from 'cc';
import { GameController } from './GameController';
import { Hole } from './Hole';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass("Bolt")
export class Bolt extends Component {

    @property(sp.Skeleton)
    boltAnim: sp.Skeleton

    @property(AudioClip)
    clipScrew: AudioClip

   // @property(Node)
    public holeScrewedIn: Hole

    public isScrew: boolean = true
    
    start() {
        log("Bolt Start Here")
        this.playAnimationScrew()
        this.node.on(Input.EventType.MOUSE_UP, this.onTouch, this)
        this.holeScrewedIn = this.node.parent.getComponent(Hole)
        
        //this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        //console.log('Collision started with:', otherCollider.node.name);
    }

    update(deltaTime: number) {
        this.node.setWorldRotation(Quat.fromEuler(new Quat(), 0,0,0))
    }

    onTouch(event: EventTouch)
    {
        GameController.instance.resetTimeCoolDownShowGuide()

        if(GameController.instance.isAlwaysRedirectToStore)
        {
            GameController.instance.redirectToStore()
            return
        }

        log("Bolt Touch here")
        GameController.instance.showIQ()
        GameController.instance.setSelectedBolt(this)
        GameController.instance.deActiveHand()
    }

    public playAnimationScrew(callback: () => void = null)
    {
        this.isScrew = true
        let trackEntry = this.boltAnim.setAnimation(0,"4close", false);
        this.boltAnim.addAnimation(0, "1idleClose", true, 0)
        AudioManager.instance.playSoundFx(this.clipScrew)
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
        AudioManager.instance.playSoundFx(this.clipScrew)
        // trackEntry.listener.end = (entry: sp.spine.TrackEntry) => {
        //     if(entry.animation.name == "2open")
        //     {
        //         callback?.()
        //     }
        // }
    }
}


