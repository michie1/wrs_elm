module App.Model exposing (App, initial)

import Race.Model exposing (Race)
import Rider.Model exposing (Rider)
import Result.Model exposing (Result)
import App.Msg exposing (Msg)
import App.Page exposing (Page)
import App.Flags exposing (Flags)


type alias App =
    { page : Page
    , riders : Maybe (List Rider)
    , races : Maybe (List Race)
    , results : Maybe (List Result.Model.Result)
    }


initial : Flags -> App
initial flags =
    App App.Page.Races Nothing Nothing Nothing
