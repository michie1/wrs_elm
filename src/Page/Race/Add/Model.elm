module Page.Race.Add.Model exposing (Model)

import Data.RaceType exposing (RaceType)
import Date
import DatePicker


type alias Model =
    { name : String
    , raceType : RaceType
    , date : Maybe Date.Date
    , datePicker : DatePicker.DatePicker
    }
