port module Main exposing (..)

import Navigation
import App.Model exposing (App)
import App.Routing
import App.Msg exposing (Msg(..))
import App.Update
import App.UrlUpdate
import App.View
import Rider.Model
import Race.Model
import Result.Model
import Comment.Model
import WebSocket
import Ui.Ratings
import App.Flags exposing (Flags)

port login : (String -> msg) -> Sub msg
port logout : (String -> msg) -> Sub msg

main : Program Flags App Msg
main =
    Navigation.programWithFlags
        parser
        { init = init
        , update = App.Update.update
        , subscriptions = subscriptions
        , view = App.View.render
        }


parser : Navigation.Location -> Msg
parser location =
    UrlUpdate (App.Routing.routeParser location)


init : Flags -> Navigation.Location -> ( App, Cmd Msg )
init flags location =
    let
        route =
            App.Routing.routeParser location

        ( initialApp, initialCmd ) =
            App.Model.initial flags

        ( app, cmd ) =
            App.UrlUpdate.urlUpdate route initialApp
    in
        ( app
        , Cmd.batch
            [ cmd
            , initialCmd
            ]
        )


subscriptions : App -> Sub Msg
subscriptions app =
    Sub.batch
        [ login AccountLogin
        , logout AccountLogout
        ]
