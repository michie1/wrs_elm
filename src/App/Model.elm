module App.Model exposing (App, initial, Page, Page(..))

import Dict exposing (Dict)
import App.Routing as Routing exposing (Route(..))
import Race.Model
import Rider.Model
import Result.Model
import Date
import Account.Model
import Keyboard.Extra
import Phoenix.Socket
import Phoenix.Channel
import Phoenix.Push
import App.Msg
import Ui.Ratings
import Ui.Calendar
import App.Flags exposing (Flags)


type Page
    = RaceAdd Race.Model.Add
    | AccountLogin Account.Model.Login
    | AccountSignup Account.Model.Signup
    | ResultAdd Result.Model.Add
    | NoOp


type alias App =
    { route : Routing.Route
    , page : Page
    , riders : Maybe (List Rider.Model.Rider)
    , races : Maybe (List Race.Model.Race)
    , results : List Result.Model.Result
    , now : Maybe Date.Date
    , account : Maybe Account.Model.Account
    , messages : List String
    , ratings : Ui.Ratings.Model
    }


initial : Flags -> ( App, Cmd App.Msg.Msg )
initial flags =
    ( App
    Home
    NoOp
    Nothing
    Nothing
    Result.Model.initialResults
    Nothing
    Account.Model.initial
        []
        (Ui.Ratings.init () |> Ui.Ratings.size 10)
        , Cmd.none
        )
