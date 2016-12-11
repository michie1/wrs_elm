module App.Model exposing (App, initial)

import Dict exposing (Dict)
import App.Routing as Routing exposing (Route(..))
import Race.Model
import Rider.Model
import Results.Model
import Comment.Model
import Date
import Account.Model
import Keyboard.Extra

import Phoenix.Socket
import Phoenix.Channel

import App.Msg


type alias App =
    { route : Routing.Route
    , cache : Dict String (List String)
    , riders : Maybe (List Rider.Model.Rider)
    , races : List Race.Model.Race
    , raceAdd : Maybe Race.Model.Add
    , riderAdd : Rider.Model.RiderAdd
    , results : List Results.Model.Result
    , resultAdd : Maybe Results.Model.ResultAdd
    , comments : List Comment.Model.Comment
    , commentAdd : Maybe Comment.Model.Add
    , now : Maybe Date.Date
    , account : Maybe Rider.Model.Rider
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
            |> Phoenix.Socket.on "createdRider" "room:lobby" App.Msg.OnCreatedRider
            |> Phoenix.Socket.on "updatedRider" "room:lobby" App.Msg.OnUpdatedRider
            |> Phoenix.Socket.join channel
    in
        (App
            Home
            Dict.empty
            Nothing --Rider.Model.initialRiders
            Race.Model.initialRaces
            Nothing
            Rider.Model.empty
            Results.Model.initialResults
            Nothing
            Comment.Model.initialComments
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
