module Page.Result.Edit.Msg exposing (Msg, Msg(..))
import Data.ResultCategory exposing (ResultCategory)

type Msg
    = Submit
    | Result String
    | Category ResultCategory
