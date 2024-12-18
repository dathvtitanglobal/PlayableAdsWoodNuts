
export class super_html_playable {

    download() {
        console.log("download");
        //@ts-ignore
        window.super_html && super_html.download();
    }

    game_end() {
        console.log("game end");
        // //@ts-ignore
        // window.super_html && super_html.game_end();
        //@ts-ignore
        window.gameEnd && window.gameEnd();
        //@ts-ignore
        window.install && window.install();
    }

    game_start() {
        console.log("game start");
        //@ts-ignore
        window.super_html && super_html.game_start();
        //gameStart()
    }

    game_ready()
    {
        console.log("game ready")
        //@ts-ignore
        window.gameReady && window.gameReady();
    }



    /**
     * 是否隐藏下载按钮，意味着使用平台注入的下载按钮
     * channel : google
     */
    is_hide_download() {
        //@ts-ignore
        if (window.super_html && super_html.is_hide_download) {
            //@ts-ignore
            return super_html.is_hide_download();
        }
        return false
    }

    /**
     * 设置商店地址
     * channel : unity
     * @param url https://play.google.com/store/apps/details?id=ttg.puzzle.tile.triple.match.rescue.game
     */
    set_google_play_url(url: string) {
        //@ts-ignore
        window.super_html && (super_html.google_play_url = url);
    }

    /**
    * 设置商店地址
    * channel : unity
    * @param url 
    */
    set_app_store_url(url: string) {
        //@ts-ignore
        window.super_html && (super_html.appstore_url = url);
    }

    


}
export default new super_html_playable();

export function gameClose()
{

}

export function gameStart() 
{
    
}

