module Page.Race.Add.Model exposing (Model)

import Date exposing (Date)
import Ui.Calendar
import Data.RaceType exposing (RaceType)


type alias Model =
    { name : String
    , raceType : RaceType
    , calendar : Ui.Calendar.Model
    }
