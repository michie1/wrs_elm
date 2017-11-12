module Page.Result.Add.Msg exposing (Msg, Msg(..))

import Ui.Chooser
import Data.Outfit exposing (Outfit)
import Data.ResultCategory exposing (ResultCategory)


type Msg
    = Submit
    | Category ResultCategory
    | Outfit Outfit
    | Result String
    | Chooser Ui.Chooser.Msg
