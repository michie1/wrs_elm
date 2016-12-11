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
import Task
import Date
import Keyboard.Extra
import WebSocket
import Phoenix.Socket


type alias Flags =
    { riders : List Rider.Model.Rider
    , races : List Race.Model.Race
    , results : List Result.Model.Result
    , comments : List Comment.Model.Comment
    }


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
        route =
            Debug.log "route in init" (App.Routing.routeParser location)

        ( initialApp, initialCmd ) =
            App.Model.initial

        ( app, cmd ) =
            App.UrlUpdate.urlUpdate route initialApp
    in
        ( app
        , Cmd.batch
            [ cmd
            , Cmd.map App.Msg.KeyboardMsg (Tuple.second Keyboard.Extra.init)
            , initialCmd
            ]
        )


now : Cmd Msg
now =
    Task.perform
        (Just >> App.Msg.SetNow)
        Date.now


port log : (String -> msg) -> Sub msg


port setState : (String -> msg) -> Sub msg


port setAutocomplete : (( String, String ) -> msg) -> Sub msg


subscriptions : App -> Sub Msg
subscriptions app =
    Sub.batch
        [ setAutocomplete App.Msg.SetAutocomplete
        , Sub.map KeyboardMsg Keyboard.Extra.subscriptions
          --, WebSocket.listen "ws://echo.websocket.org" NewMessage
          -- , WebSocket.listen "ws://localhost:4000/socket/websocket" NewMessage
        , Phoenix.Socket.listen app.phxSocket PhoenixMsg
        ]
