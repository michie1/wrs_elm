module Main exposing (main)

import Navigation
import App.Model exposing (App)
import App.Routing
import App.Msg as Msg exposing (Msg)
import App.Update
import App.UrlUpdate
import App.View
import App.OutsideInfo


main : Program Never App Msg
main =
    Navigation.program
        parser
        { init = init
        , update = App.Update.update
        , subscriptions = subscriptions
        , view = App.View.view
        }


parser : Navigation.Location -> Msg
parser location =
    Msg.UrlUpdate (App.Routing.routeParser location)


init : Navigation.Location -> ( App, Cmd Msg )
init location =
    let
        route =
            App.Routing.routeParser location

        initialApp =
            App.Model.initial

        ( app, cmd ) =
            App.UrlUpdate.urlUpdate route initialApp
    in
        ( app, cmd )


subscriptions : App -> Sub Msg
subscriptions _ =
    Sub.batch [ App.OutsideInfo.getInfoFromOutside Msg.Outside Msg.LogErr ]
