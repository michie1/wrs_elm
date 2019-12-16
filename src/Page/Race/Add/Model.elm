module Page.Race.Add.Model exposing (Model)

import Data.RaceType exposing (RaceType)
import Date exposing (Date)
import DatePicker


type alias Model =
    { name : String
    , raceType : RaceType
    , date : Maybe Date
    , datePicker : DatePicker.DatePicker
    }
