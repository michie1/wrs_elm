module Main exposing (main)

import App.Model exposing (App)
import App.Msg as Msg exposing (Msg)
import App.OutsideInfo
import App.Routing
import App.Update
import App.UrlUpdate
import App.View
import Browser
import Data.Flags exposing (Flags)
import Url


main : Program Flags App Msg
main =
    Browser.element
        { init = init
        , update = App.Update.update
        , subscriptions = subscriptions
        , view = App.View.view
        }


parser : Url.Url -> Msg
parser location =
    Msg.UrlUpdate (App.Routing.routeParser location)


init : Flags -> ( App, Cmd Msg )
init flags =
    let
        initialApp =
            App.Model.initial flags

        -- TODO: parse default location
        -- App.UrlUpdate.urlUpdate
        -- route
        ( app, cmd ) =
            ( initialApp, Cmd.none )
    in
    ( app, cmd )


subscriptions : App -> Sub Msg
subscriptions _ =
    Sub.batch [ App.OutsideInfo.getInfoFromOutside Msg.Outside Msg.LogErr ]
