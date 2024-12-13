import { _decorator, Collider2D, Component, Contact2DType, director, EventTouch, geometry, input, Input, IPhysics2DContact, log, Node, Physics2DUtils, PhysicsSystem } from 'cc';
import { Bolt } from './Bolt';
import { GameController } from './GameController';
import { Timber } from './Timber';
const { ccclass, property } = _decorator;

@ccclass('Hole')
export class Hole extends Component {

    @property(Collider2D)
    collider: Collider2D

    public boltScrewedIn: Bolt = null

    public isHoleOnTimber: boolean = false

    public isOverLapTimber: boolean = false

    private overlapGameObjects: Collider2D[] = []

    start() {

        this.isHoleOnTimber = this.node.parent.getComponent(Timber) != null

        //this.node.on(Input.EventType.MOUSE_UP, this.onTouch, this)
        //this.boltScrewedIn = this.getComponentInChildren(Bolt)
        this.updateBoltScrewIn()
        if(!this.isHoleOnTimber && this.collider != null)
        {
            log("Handle hole on board")
            this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
            this.collider.on(Contact2DType.END_CONTACT, this.onEndContact, this)
        }
    }

    update(deltaTime: number) {
       
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
        //this.overlapGameObjects.(otherCollider)
        const index = this.overlapGameObjects.indexOf(otherCollider, 0);
        if (index < 0) {
            log('Hole Collision started with:', otherCollider.node.name)
            this.overlapGameObjects.push(otherCollider);
        }
    }

    onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        
        //this.overlapGameObjects.(otherCollider)
        const index = this.overlapGameObjects.indexOf(otherCollider, 0);
        if (index >= 0) {
            log('Hole Collision end with:', otherCollider.node.name)
            this.overlapGameObjects.splice(index, 1);
        }
    }

    onPreSolve (selfCollider: Collider2D, otherColliders: Collider2D[], contact: IPhysics2DContact | null) {
        // will be called every time collider contact should be resolved
        log('onPreSolve');
        this.overlapGameObjects = otherColliders
    }

    public onTouch(event: EventTouch = null)
    {
        log("Hole Touch here")

        GameController.instance.resetTimeCoolDownShowGuide()

        if(!this.canScrew())
        {
            log("Cannot screw")
            return
        }

        if(GameController.instance.isAlwaysRedirectToStore)
        {
            GameController.instance.redirectToStore()
            return
        }

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
        if(this.isHoleOnTimber)
        {
            var holeOnBoard = GameController.instance.getHoleOnBoardAtPos(this.node.worldPosition)
            if(holeOnBoard == null)
            {
                log("Hole on Timber block by board")
                return false
            }
            else
            {
                log("Check hole on board")
                return holeOnBoard.canScrew()
            }
        }

        if(this.overlapGameObjects == null || this.overlapGameObjects.length <= 0)
        {
            log("Hole on board no obstacle")
            return true
        }
        else if(GameController.instance.getBoltAtPos(this.node.worldPosition) != null)
        {
            return false
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
                        log("Hole on board block by timber")
                        return false
                    }
                }
            } 
            return true
        }
        log("Hole cannot screw here")
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


