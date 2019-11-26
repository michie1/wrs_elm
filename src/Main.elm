module Main exposing (main)

import App.Model exposing (App)
import App.Msg as Msg exposing (Msg)
import App.OutsideInfo
import App.Routing
import App.Update
import App.UrlUpdate
import App.View
import Data.Flags exposing (Flags)
import Navigation


main : Program Flags App Msg
main =
    Navigation.programWithFlags
        parser
        { init = init
        , update = App.Update.update
        , subscriptions = subscriptions
        , view = App.View.view
        }


parser : Navigation.Location -> Msg
parser location =
    Msg.UrlUpdate (App.Routing.routeParser location)


init : Flags -> Navigation.Location -> ( App, Cmd Msg )
init flags location =
    let
        route =
            App.Routing.routeParser location

        initialApp =
            App.Model.initial flags

        ( app, cmd ) =
            App.UrlUpdate.urlUpdate route initialApp
    in
    ( app, cmd )


subscriptions : App -> Sub Msg
subscriptions _ =
    Sub.batch [ App.OutsideInfo.getInfoFromOutside Msg.Outside Msg.LogErr ]
