module App.Model exposing (App, initial, Page, Page(..))

import Dict exposing (Dict)
import App.Routing as Routing exposing (Route(..))
import Race.Model
import Rider.Model
import Result.Model
import Comment.Model
import Date
import Account.Model
import Keyboard.Extra
import Phoenix.Socket
import Phoenix.Channel
import App.Msg

type Page
    = RaceAdd Race.Model.Add
    | AccountLogin Account.Model.Login
    | AccountSignup Account.Model.Signup
    | ResultAdd Result.Model.Add
    | CommentAdd Comment.Model.Add
    | NoOp

type alias App =
    { route : Routing.Route
    , page : Page
    , riders : Maybe (List Rider.Model.Rider)
    , races : Maybe (List Race.Model.Race)
    , results : List Result.Model.Result
    , comments : List Comment.Model.Comment
    , now : Maybe Date.Date
    , account : Maybe Rider.Model.Rider
    , messages : List String
    , messageInProgress : String
    , phxSocket : Phoenix.Socket.Socket App.Msg.Msg
    }


initial : ( App, Cmd App.Msg.Msg )
initial =
    let
        channel =
            Phoenix.Channel.init "room:lobby"

        ( initSocket, phxCmd ) =
            Phoenix.Socket.init "ws://localhost:4000/socket/websocket"
                |> Phoenix.Socket.withDebug
                |> Phoenix.Socket.on "shout" "room:lobby" App.Msg.ReceiveMessage
                |> Phoenix.Socket.on "createdRider" "room:lobby" App.Msg.OnCreatedRider
                |> Phoenix.Socket.on "createdRace" "room:lobby" App.Msg.OnCreatedRace
                |> Phoenix.Socket.on "updatedRider" "room:lobby" App.Msg.OnUpdatedRider
                |> Phoenix.Socket.join channel
    in
        ( App
            Home
            NoOp --(RaceAdd (Race.Model.Add "" "" Nothing))
            Nothing
            (Just Race.Model.initialRaces)
            Result.Model.initialResults
            Comment.Model.initialComments
            Nothing
            Account.Model.initial
            []
            ""
            initSocket
        , Cmd.map App.Msg.PhoenixMsg phxCmd
        )
