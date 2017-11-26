module Page.Result.Add.Msg exposing (Msg, Msg(..))

import Data.Outfit exposing (Outfit)
import Data.ResultCategory exposing (ResultCategory)


type Msg
    = Submit
    | Category ResultCategory
    | Outfit Outfit
    | Result String
    | Rider String
