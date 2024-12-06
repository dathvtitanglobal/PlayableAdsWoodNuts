import { _decorator, Component, director, Game, Node } from 'cc';
import { Bolt } from './Bolt';
import { Timber } from './Timber';
import { Hole } from './Hole';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {

    public static instance: GameController

    private currentBoltSelected: Bolt = null

    public listTimber: Timber[]

    public listHole: Hole[]

    start() {
       GameController.instance = this

       this.listTimber = this.getComponentsInChildren(Timber)

       this.listHole = this.getComponentsInChildren(Hole)
    }

    update(deltaTime: number) {
        
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
            this.currentBoltSelected = null
            if(this.currentBoltSelected != null)
            {
                this.currentBoltSelected.playAnimationScrew()
            }
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
}


