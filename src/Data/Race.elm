module Data.Race exposing (Race)

import Date exposing (Date)
import Data.RaceType exposing (RaceType)

type alias Race =
    { key : String
    , name : String
    , date : Date
    , raceType : RaceType
    }
