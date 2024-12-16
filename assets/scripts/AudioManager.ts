import { _decorator, AudioClip, AudioSource, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('AudioManager')
export class AudioManager extends Component {

    public static instance: AudioManager

    @property(AudioSource)
    soundFxSource: AudioSource

    @property(AudioSource)
    backgroundMusic: AudioSource

    @property(AudioClip)
    timberCollide: AudioClip

    start() {
        AudioManager.instance = this
    }

    public playSoundFx(clip: AudioClip, volume: number = 1)
    {
        this.soundFxSource.clip = clip
        this.soundFxSource.play()
    }

    public playBackgroundMusic()
    {
        this.backgroundMusic.play()
    }

    public playSoundTimberCollide()
    {
        this.playSoundFx(this.timberCollide)
    }

}


