import { _decorator, AudioClip, BoxCollider2D, Camera, Collider2D, Component, Contact2DType, ERigidBody2DType, HingeJoint2D, IPhysics2DContact, log, Node, RigidBody2D, Size, UITransform, Vec2, Vec3 } from 'cc';
import { Hole } from './Hole';
import { Bolt } from './Bolt';
import { GameController } from './GameController';
import { AudioManager } from './AudioManager';
const { ccclass, property } = _decorator;

@ccclass('Timber')
export class Timber extends Component {

    @property(RigidBody2D)
    rigidbody: RigidBody2D

    @property(Collider2D)
    collider: Collider2D

    @property(HingeJoint2D)
    hingeJoint: HingeJoint2D

    @property(UITransform)
    timber: UITransform

    listHole: Hole[] 

    public isActive = true

    public deltaDistance = 10

    start() {
        this.collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this)
        this.getListHole()
      
        var newBoxCollider = this.addComponent(BoxCollider2D)
        newBoxCollider.size = new Size(this.timber.contentSize.x * 0.6, this.timber.contentSize.y * 0.6)

        var offset = new Vec3()
        this.node.inverseTransformPoint(offset, this.timber.node.worldPosition)
        newBoxCollider.offset = offset.toVec2()
        newBoxCollider.group = 1<<17
        newBoxCollider.restitution = 0.25


        setTimeout(() => {
            this.checkEnablePhysic()
        }, 2000)
        
    }

    onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
        //log('Collision started with:', otherCollider.node.name)
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
            GameController.instance.updateIQ(5)
            GameController.instance.checkAndPerformNextAction()
        }

        if(otherCollider.getComponent(Timber) != null || otherCollider.getComponent(Bolt) != null)
        {
            AudioManager.instance.playSoundTimberCollide()
        }
    }

    update(deltaTime: number) {
        //this.rigidbody.angularVelocity = 0
    }  

    public getListHole(): Hole[]
    {
        if(this.listHole == null || this.listHole.length <= 0)
        {
            this.listHole = this.getAllComponentsInChildren(this.node, Hole)
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
        log("Timber get hole at pos, list hole:", this.listHole.length)
        for(var i = 0; i<this.listHole.length; i++)
        {
            if(Vec2.distance(worldPos.toVec2(), this.listHole[i].node.worldPosition.toVec2()) < this.deltaDistance)
            {
                log("Have hole here")
                return this.listHole[i]
            }
        }

        return null
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
}


