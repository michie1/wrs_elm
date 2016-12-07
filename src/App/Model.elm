module App.Model exposing (App, initial)

import Dict exposing (Dict)
import App.Routing as Routing exposing (Route(..))
import Races.Model
import Riders.Model
import Results.Model
import Comments.Model
import Date
import Account.Model
import Keyboard.Extra

import Phoenix.Socket
import Phoenix.Channel

import App.Msg


type alias App =
    { route : Routing.Route
    , cache : Dict String (List String)
    , riders : Maybe (List Riders.Model.Rider)
    , races : List Races.Model.Race
    , raceAdd : Maybe Races.Model.Add
    , riderAdd : Riders.Model.RiderAdd
    , results : List Results.Model.Result
    , resultAdd : Maybe Results.Model.ResultAdd
    , comments : List Comments.Model.Comment
    , commentAdd : Maybe Comments.Model.Add
    , now : Maybe Date.Date
    , account : Maybe Riders.Model.Rider
    , accountLogin : Maybe Account.Model.Login
    , accountSignup : Maybe Account.Model.Signup
    , keyboardModel : Keyboard.Extra.Model
    , input : String
    , messages : List String
    , messageInProgress : String
    , phxSocket : Phoenix.Socket.Socket App.Msg.Msg
    }


initial : ( App, Cmd App.Msg.Msg )
initial =
    let
        channel = Phoenix.Channel.init "room:lobby"
        (initSocket, phxCmd) =
            Phoenix.Socket.init "ws://localhost:4000/socket/websocket"
            |> Phoenix.Socket.withDebug
            |> Phoenix.Socket.on "shout" "room:lobby" App.Msg.ReceiveMessage
            |> Phoenix.Socket.join channel
    in
        (App
            Home
            Dict.empty
            Nothing --Riders.Model.initialRiders
            Races.Model.initialRaces
            Nothing
            Riders.Model.empty
            Results.Model.initialResults
            Nothing
            Comments.Model.initialComments
            Nothing
            Nothing
            Account.Model.initial
            Nothing
            Nothing
            (Tuple.first Keyboard.Extra.init)
            ""
            []
            ""
            -- (Phoenix.Socket.init "ws://localhost:4000/socket/websocket")
            initSocket
        , Cmd.map App.Msg.PhoenixMsg phxCmd
        )
