module Page.Race.Add.Msg exposing (Msg, Msg(..))

import Data.RaceType exposing (RaceType)
import DatePicker

type Msg
    = Submit
    | Name String
    | RaceType RaceType
    | ToDatePicker DatePicker.Msg
