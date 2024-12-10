import { _decorator, Collider2D, Component, Contact2DType, EventTouch, geometry, Input, IPhysics2DContact, log, Node, Physics2DUtils, PhysicsSystem } from 'cc';
import { Bolt } from './Bolt';
import { GameController } from './GameController';
import { Timber } from './Timber';
const { ccclass, property } = _decorator;

@ccclass('Hole')
export class Hole extends Component {

    @property(Collider2D)
    collider: Collider2D

    //@property({type:Node})
    public boltScrewedIn: Bolt = null

    public isHoleOnTimber: boolean = false

    public isOverLapTimber: boolean = false

    private overlapGameObjects: Collider2D[]

    start() {

        this.isHoleOnTimber = this.node.parent.getComponent(Timber) != null

        this.node.on(Input.EventType.MOUSE_UP, this.onTouch, this)
        this.boltScrewedIn = this.getComponentInChildren(Bolt)
        //this.updateBoltScrewIn()
        // if(!this.isHoleOnTimber)
        // {
        //     this.collider.on(Contact2DType.PRE_SOLVE, this.onPreSolve, this)
        // }
    }

    update(deltaTime: number) {
        
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        log('Collision started with:', otherCollider.node.name)

    }

    onPreSolve (selfCollider: Collider2D, otherColliders: Collider2D[], contact: IPhysics2DContact | null) {
        // will be called every time collider contact should be resolved
        console.log('onPreSolve');
        this.overlapGameObjects = otherColliders
    }

    onTouch(event: EventTouch)
    {
        if(!this.canScrew())
        {
            return
        }

        if(GameController.instance.isAlwaysRedirectToStore)
        {
            GameController.instance.redirectToStore()
            return
        }

        log("Hole Touch here")
        if( this.boltScrewedIn != null)
        {
            return
        }
        var bolt = GameController.instance.getSelectedBolt()

        if(bolt == null)
        {
            return
        }

        GameController.instance.unscrewFromHole(bolt.holeScrewedIn, bolt)
        GameController.instance.screwToHole(this, bolt)
    }

    public getBoltScrewedIn(): Bolt
    {
        return this.boltScrewedIn
    }

    public canScrew(): boolean 
    {
        if(this.overlapGameObjects == null || this.overlapGameObjects.length <= 0)
        {
            return true
        }
        else
        {
            for(var i=0; i<this.overlapGameObjects.length; i++)
            {
                var timber = this.overlapGameObjects[i].getComponent(Timber)
                if(timber != null)
                {
                    if(timber.getHoleAtPos(this.node.worldPosition) == null)
                    {
                        return false
                    }
                }
            } 
        }

        return false
    }

    public updateBoltScrewIn()
    {
        var boltChild = this.getComponentInChildren(Bolt) 
        if(boltChild == null)
        {
            this.boltScrewedIn =  GameController.instance.getBoltAtPos(this.node.worldPosition) 
        }
        else
        {
            this.boltScrewedIn = boltChild
        }

        log("Bolt = null: ", this.boltScrewedIn == null)
    }
}


