module Race.Model exposing (Add)

import Date exposing (Date)
import Ui.Calendar
import Data.RaceType exposing (RaceType)


type alias Add =
    { name : String
    , raceType : RaceType
    , calendar : Ui.Calendar.Model
    }
