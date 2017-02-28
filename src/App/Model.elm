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
import Phoenix.Push
import App.Msg
import Ui.Ratings
import Ui.Calendar


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
    , comments : Maybe (List Comment.Model.Comment)
    , now : Maybe Date.Date
    , account : Maybe Rider.Model.Rider
    , messages : List String
    , phxSocket : Phoenix.Socket.Socket App.Msg.Msg
    , connected : Bool
    , ratings : Ui.Ratings.Model
    }


initial : ( App, Cmd App.Msg.Msg )
initial =
    let
        channel =
            Phoenix.Channel.init "room:lobby"
                |> Phoenix.Channel.onJoin (always App.Msg.OnJoin)

        ( initSocket, phxCmd ) =
            Phoenix.Socket.init "ws://localhost:4000/socket/websocket"
                |> Phoenix.Socket.withDebug
                |> Phoenix.Socket.on "shout" "room:lobby" App.Msg.ReceiveMessage
                |> Phoenix.Socket.on "createdRider" "room:lobby" App.Msg.OnCreatedRider
                |> Phoenix.Socket.on "createdRace" "room:lobby" App.Msg.OnCreatedRace
                |> Phoenix.Socket.on "createdResult" "room:lobby" App.Msg.OnCreatedResult
                |> Phoenix.Socket.on "createdComment" "room:lobby" App.Msg.OnCreatedComment
                |> Phoenix.Socket.on "updatedRider" "room:lobby" App.Msg.OnUpdatedRider
                |> Phoenix.Socket.join channel
    in
        ( App
            Home
            NoOp
            Nothing
            Nothing
            Result.Model.initialResults
            Nothing
            --Comment.Model.initialComments
            Nothing
            Account.Model.initial
            []
            initSocket
            False
            (Ui.Ratings.init () |> Ui.Ratings.size 10)
        , Cmd.map App.Msg.PhoenixMsg phxCmd
        )
