module Page.Result.Add.Msg exposing (Msg, Msg(..))

import Json.Decode
import Ui.Chooser
import Data.Outfit exposing (Outfit)
import Data.ResultCategory exposing (ResultCategory)

type Msg
    = ResultAddSubmit
    | ResultAddCategory ResultCategory
    | ResultAddOutfit Outfit
    | ResultAddResult String
    | Chooser Ui.Chooser.Msg
