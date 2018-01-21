module Page.Race.Add.Model exposing (Model)

import Date
import Data.RaceType exposing (RaceType)
import DatePicker


type alias Model =
    { name : String
    , raceType : RaceType
    , date : Maybe Date.Date
    , datePicker : DatePicker.DatePicker
    }
