module Main exposing (main)

import App.Model exposing (App)
import App.Msg as Msg exposing (Msg)
import App.OutsideInfo
import App.Routing
import App.Update
import App.UrlUpdate
import App.View
import Browser
import Browser.Navigation
import Data.Flags exposing (Flags)
import Url


main : Program Flags App Msg
main =
    Browser.application
        { init = init
        , onUrlChange = Msg.OnUrlChange
        , onUrlRequest = Msg.OnUrlRequest
        , update = App.Update.update
        , subscriptions = subscriptions
        , view = App.View.view
        }


init : Flags -> Url.Url -> Browser.Navigation.Key -> ( App, Cmd Msg )
init flags url navKey =
    let
        route =
            App.Routing.parseUrl url

        initialApp =
            App.Model.initial flags navKey

        ( app, cmd ) =
            App.UrlUpdate.urlUpdate route initialApp
    in
    ( app, cmd )


subscriptions : App -> Sub Msg
subscriptions _ =
    Sub.batch [ App.OutsideInfo.getInfoFromOutside Msg.Outside Msg.LogErr ]
