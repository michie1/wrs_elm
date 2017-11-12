module Page.Rider.Add.Msg exposing (Msg, Msg(..))

import Data.Licence exposing (Licence)


type Msg
    = Submit
    | Licence Licence
    | Name String
