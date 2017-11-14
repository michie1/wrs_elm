module App.Model exposing (App, initial)

import Data.Race exposing (Race)
import Data.Rider exposing (Rider)
import Data.RaceResult exposing (RaceResult)
import App.Page exposing (Page)


type alias App =
    { page : Page
    , riders : Maybe (List Rider)
    , races : Maybe (List Race)
    , results : Maybe (List RaceResult)
    }


initial : App
initial =
    App App.Page.Races Nothing Nothing Nothing
