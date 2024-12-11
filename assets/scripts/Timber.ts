import { _decorator, Camera, Collider2D, Component, Contact2DType, ERigidBody2DType, HingeJoint2D, IPhysics2DContact, log, Node, RigidBody2D, Vec2, Vec3 } from 'cc';
import { Hole } from './Hole';
import { Bolt } from './Bolt';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

@ccclass('Timber')
export class Timber extends Component {

    @property(RigidBody2D)
    rigidbody: RigidBody2D

    @property(Collider2D)
    collider: Collider2D

    @property(HingeJoint2D)
    hingeJoint: HingeJoint2D

    listHole: Hole[] 

    public isActive = true

    public deltaDistance = 0.01

    start() {
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.getListHole()
        setTimeout(() => {
            this.checkEnablePhysic()
        }, 2000)
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        log('Collision started with:', otherCollider.node.name)
        if(otherCollider.node.name == "BottomTrigger" && this.isActive)
        {
            this.isActive = false
            // this.rigidbody.enabled = false
            // this.collider.enabled = false
            // this.node.active = false
            //this.node.destroy()
            setTimeout(() => {
                this.node.active = false
            }, 2000)
            GameController.instance.checkAndPerformNextAction()
        }
    }

    update(deltaTime: number) {
        //this.rigidbody.angularVelocity = 0
    }  

    public getListHole(): Hole[]
    {
        if(this.listHole == null || this.listHole.length <= 0)
        {
            this.listHole = this.getComponentsInChildren(Hole)
        }

        return this.listHole
    }

    public countBoltScrewedIn(): number
    {
        if(this.listHole == null)
        {
            return 0
        }

        let res = 0
        log("List Hole Count: " + this.listHole.length)
        for(let i =0; i<this.listHole.length; i++)
        {
            var hole = this.listHole[i]
            if(hole.getBoltScrewedIn() != null)
            {
                res ++
            }
        }
        return res
    }

    public getLastHoleHaveBoltInBoard(): Hole
    {
        for(let i =0; i<this.listHole.length; i++)
        {
            var hole = this.listHole[i]
            if(hole.getBoltScrewedIn() != null)
            {
                return hole
            }
            
        }

        return null
    }

    public checkEnablePhysic()
    {
        var numBoltScrewedIn = this.countBoltScrewedIn();
        log("Number Bolt Screwd in: " + this.countBoltScrewedIn())

        if(numBoltScrewedIn > 1)
        {
            //this.hingeJoint.enabled = false
            //this.rigidbody.type = ERigidBody2DType.Kinematic
            //this.rigidbody.

            // this.rigidbody.linearVelocity = Vec2.ZERO
            // this.rigidbody.angularVelocity = 0
            // this.rigidbody.angularDamping = 0;
            // this.rigidbody.linearDamping = 0;
        }
        else if(numBoltScrewedIn == 1)
        {
            // const worldAnchorPosition = this.node..(hingeJoint2D.anchor);
            // const worldCenterOfMass = this.rigidbody.getWorldCenter(out); 
            const forceX = 5;
            //this.rigidbody.applyForceToCenter(new Vec2(forceX, 0), true)

            

            //this.hingeJoint.connectedAnchor = this.getLastHoleHaveBoltInBoard().node.position.toVec2()
            var localPoint = new Vec3()
            this.hingeJoint.anchor = this.node.inverseTransformPoint(localPoint, this.getLastHoleHaveBoltInBoard().node.worldPosition).toVec2()
            this.hingeJoint.connectedAnchor = this.getLastHoleHaveBoltInBoard().node.worldPosition.toVec2()
            this.hingeJoint.enabled = true

            this.rigidbody.type = ERigidBody2DType.Dynamic
            this.rigidbody.enabled = true
            // this.rigidbody.angularDamping = 0.05;
            // this.rigidbody.linearDamping = 0.05;

            //this.hingeJoint.connectedAnchor = this.node.position.toVec2()
        }
        else if(numBoltScrewedIn <= 0)
        {
            this.hingeJoint.enabled = false
            // this.rigidbody.type = ERigidBody2DType.Dynamic
            // this.rigidbody.enabled = true
        }
    }

    public getHoleAtPos(worldPos: Vec3): Hole
    {
        for(var i = 0; i<this.listHole.length; i++)
        {
            if(Vec2.distance(worldPos.toVec2(), this.listHole[i].node.worldPosition.toVec2()) < this.deltaDistance)
            {
                return this.listHole[i]
            }
        }

        return null
    }
}


