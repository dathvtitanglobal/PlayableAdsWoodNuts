import { _decorator, Collider2D, Component, Contact2DType, ERigidBody2DType, HingeJoint2D, IPhysics2DContact, log, Node, RigidBody2D } from 'cc';
import { Hole } from './Hole';
import { Bolt } from './Bolt';
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

    start() {
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.getListHole()
        this.checkEnablePhysic()
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        log('Collision started with:', otherCollider.node.name)
    }

    update(deltaTime: number) {
        
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
        let res = 0
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

    public getLastBoltInBoard(): Bolt
    {
        for(let i =0; i<this.listHole.length; i++)
        {
            var hole = this.listHole[i]
            if(hole.getBoltScrewedIn() != null)
            {
                return hole.getBoltScrewedIn()
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
            this.hingeJoint.enabled = false
            this.rigidbody.type = ERigidBody2DType.Static
        }
        else if(numBoltScrewedIn == 1)
        {
            this.hingeJoint.enabled = true
            this.hingeJoint.anchor = this.getLastBoltInBoard().node.position.toVec2()
            this.rigidbody.type = ERigidBody2DType.Dynamic
        }
    }
}


