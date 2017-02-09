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
import Phoenix.Socket

main : Program Never App Msg
main =
    Navigation.program
        parser
        { init = init
        , update = App.Update.update
        , subscriptions = subscriptions
        , view = App.View.render
        }


parser : Navigation.Location -> Msg
parser location =
    UrlUpdate (App.Routing.routeParser location)


init : Navigation.Location -> ( App, Cmd Msg )
init location =
    let
        route = App.Routing.routeParser location

        ( initialApp, initialCmd ) =
            App.Model.initial

        ( app, cmd ) =
            App.UrlUpdate.urlUpdate route initialApp
    in
        ( app
        , Cmd.batch
            [ cmd
            , initialCmd
            ]
        )

port datepicker : (String -> msg) -> Sub msg

subscriptions : App -> Sub Msg
subscriptions app =
    Sub.batch
        [ Phoenix.Socket.listen app.phxSocket PhoenixMsg
        , datepicker App.Msg.DatePicked
        ]


