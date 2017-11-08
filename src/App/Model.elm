module App.Model exposing (App, initial)

import Data.Race exposing (Race)
import Data.Rider exposing (Rider)
import Data.RaceResult exposing (RaceResult)
import App.Page exposing (Page)
import App.Flags exposing (Flags)


type alias App =
    { page : Page
    , riders : Maybe (List Rider)
    , races : Maybe (List Race)
    , results : Maybe (List RaceResult)
    }


initial : Flags -> App
initial flags =
    App App.Page.Races Nothing Nothing Nothing
