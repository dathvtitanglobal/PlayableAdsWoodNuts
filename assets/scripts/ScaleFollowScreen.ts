import { _decorator, Component, Node, screen, UITransform, Vec2, Vec3, Widget } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ScaleFollowScreen')
export class ScaleFollowScreen extends Component {
    //@property(Boolean) posFollow: Boolean = false
    scaleX = -1;
    scaleY = -1;

    //sizeBegin = this.getComponent(UITransform).contentSize;


    update(deltaTime: number) {
        if (screen.windowSize.width < screen.windowSize.height){
            //console.log(screen.windowSize)
            if (this.scaleY < 0){
                this.scaleY = (screen.windowSize.width / 900) / (screen.windowSize.height /2048);
                if (screen.windowSize.width / screen.windowSize.height > 0.6){
                    this.scaleY = (screen.windowSize.width / 900) / (screen.windowSize.height /1500);
                }
            }
            //console.log(this.scaleY)
            this.node.setScale(new Vec3(this.scaleY, this.scaleY, 1))
            // if (this.posFollow) {
            //     //this.getComponent(UITransform).contentSize = this.sizeBegin
            // }
        }
        else{ 
            //console.log(screen.windowSize)
            if (this.scaleX < 0){
                this.scaleX = 2048/850;
                if (screen.windowSize.width / screen.windowSize.height < 1.7){
                    this.scaleX = 1600/850;
                }
            }
            //console.log(this.scaleX)
            this.node.setScale(new Vec3(this.scaleX, this.scaleX, 1))
            // if (this.posFollow) {
            //     //this.getComponent(Widget).contentSize = 
            // }
        }
    }
}

