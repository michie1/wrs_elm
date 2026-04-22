module Page.Rider.Edit.Msg exposing (Msg(..))

import Data.Licence exposing (Licence)


type Msg
    = Submit
    | Licence Licence
