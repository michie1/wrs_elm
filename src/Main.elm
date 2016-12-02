port module Main exposing (..)

import Navigation


import App.Model exposing (App)
import App.Routing
import App.Msg exposing (Msg(..))
import App.Update
import App.UrlUpdate
import App.View
import Riders.Model
import Races.Model
import Results.Model
import Comments.Model


import Task
import Date
import Keyboard.Extra


type alias Flags =
    { riders : List Riders.Model.Rider
    , races : List Races.Model.Race
    , results : List Results.Model.Result
    , comments : List Comments.Model.Comment
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

        ( app, cmd ) =
            App.UrlUpdate.urlUpdate route App.Model.initial
    in
        ( app
        , Cmd.batch
            [ cmd
            , Cmd.map App.Msg.KeyboardMsg (Tuple.second Keyboard.Extra.init)
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
        ]
