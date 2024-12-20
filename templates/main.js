window.googleStoreURL = "https://play.google.com/store/apps/details?id=ttg.woodscrew.puzzle.wood.nuts.bolts"
window.iosStoreURL = ""

window.setStoreUrl = function setStoreUrl(iosUrl, androidUrl){
        googleStoreURL = androidUrl
        iosStoreURL = iosUrl
}

window.redirectStore = function redirectStore()
{
    console.log("Redirect to Store here")
    if (window.isAndroid) 
    {
        mraid.open(googleStoreURL)
    }
    else if(window.isIOS)
    {
        mraid.open(iosStoreURL)
    }
}
