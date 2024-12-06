import { _decorator, Collider2D, Component, EventTouch, Input, log, Node } from 'cc';
import { Bolt } from './Bolt';
import { GameController } from './GameController';
const { ccclass, property } = _decorator;

@ccclass('Hole')
export class Hole extends Component {

    @property({type:Node})
    public boltScrewedIn: Bolt = null

    start() {
        this.node.on(Input.EventType.MOUSE_UP, this.onTouch, this)
    }

    update(deltaTime: number) {
        
    }

    onTouch(event: EventTouch)
    {
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

        bolt.node.setPosition(this.node.position) 
        this.boltScrewedIn = bolt
        bolt.holeScrewedIn.boltScrewedIn = null
        bolt.playAnimationScrew()
        GameController.instance.setSelectedBolt(null)
    }

    public getBoltScrewedIn(): Bolt
    {
        return this.boltScrewedIn
    }
}


