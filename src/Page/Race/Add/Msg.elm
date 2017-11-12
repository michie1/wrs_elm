module Page.Race.Add.Msg exposing (Msg, Msg(..))

import Data.RaceType exposing (RaceType)
import Ui.Calendar


type Msg
    = Submit
    | Name String
    | RaceType RaceType
    | Calendar Ui.Calendar.Msg
