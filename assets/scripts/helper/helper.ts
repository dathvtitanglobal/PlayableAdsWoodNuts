// assets/scripts/helper/helper.ts

class H5Playable {
    redirect() {
      console.log("download");
  
      //@ts-ignore
      if (window.redirectStore) redirectStore();

      // //@ts-ignore
      // if(accessStore) accessStore();

      //@ts-ignore
      window.install && window.install();

      //@ts-ignore
      if(typeof mraid != "undefined") mraid.open("https://play.google.com/store/apps/details?id=ttg.woodscrew.puzzle.wood.nuts.bolts")

    }
  
    /**
     * Game start method for Mintegral channel.
     */
    gameStart() {
      console.log("game start");
      //@ts-ignore
      if (typeof onGameReady !== "undefined") onGameReady();
  
      //@ts-ignore
      if (typeof startGame !== "undefined") startGame();

       //@ts-ignore
       window.gameReady && window.gameReady();
    }
  
    /**
     * Game end method when game is over, adapt for Mintegral channel.
     */
    gameEnd() {
      console.log("game end");

      //@ts-ignore
      window.gameEnd && window.gameEnd();
  
      // //@ts-ignore
      // if (typeof onGameEnd !== "undefined") onGameEnd();
    }
  
    /**
     * Set store url for redirect store action when user tap on CTA button.
     * Needed channel: Unity, Google
     * @param iosUrl: string
     * @param androidUrl: string
     */
    setStoreUrl(iosUrl: string, androidUrl: string) {
      console.log("set store url");
      //@ts-ignore
      if (window.setStoreUrl) setStoreUrl(iosUrl, androidUrl);
    }
  }
  
  const playableHelper = new H5Playable();
  export default playableHelper;
