module Race.Model exposing (Add, Race)

import Date exposing (Date)
import Ui.Calendar
import Data.RaceType exposing (RaceType)

type alias Race =
    { key : String
    , name : String
    , date : Date
    , raceType : RaceType
    }

type alias Add =
    { name : String
    , raceType : RaceType
    , calendar : Ui.Calendar.Model
    }
