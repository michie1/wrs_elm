module App.Model exposing (App, initial)

import Dict exposing (Dict)
import App.Routing as Routing exposing (Route(..))
import Race.Model
import Rider.Model
import Result.Model
import Date
import Keyboard.Extra
import Phoenix.Socket
import Phoenix.Channel
import Phoenix.Push
import App.Msg
import Ui.Ratings
import Ui.Calendar
import App.Flags exposing (Flags)
import App.Page exposing (Page)




type alias App =
    { page : Page
    , riders : Maybe (List Rider.Model.Rider)
    , races : Maybe (List Race.Model.Race)
    , results : Maybe (List Result.Model.Result)
    , now : Maybe Date.Date
    , messages : List String
    }


initial : Flags -> ( App, Cmd App.Msg.Msg )
initial flags =
    ( App
    App.Page.Races
    Nothing
    Nothing
    Nothing
    Nothing
        []
        , Cmd.none
        )
