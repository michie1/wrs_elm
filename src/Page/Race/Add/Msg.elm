module Page.Race.Add.Msg exposing (Msg, Msg(..))

import Data.RaceType exposing (RaceType)
import Ui.Calendar

type Msg
    = RaceAddSubmit
    | RaceName String
    | RaceAddRaceType RaceType
    | Calendar Ui.Calendar.Msg
