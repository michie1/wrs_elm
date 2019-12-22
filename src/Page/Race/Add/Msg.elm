module Page.Race.Add.Msg exposing (Msg(..))

import Data.RaceType exposing (RaceType)
import DatePicker
import Time


type Msg
    = Submit
    | Name String
    | RaceType RaceType
    | ToDatePicker DatePicker.Msg
