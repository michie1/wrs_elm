module Page.Rider.Add.Msg exposing (Msg(..))

import Data.Licence exposing (Licence)


type Msg
    = Submit
    | Licence Licence
    | Name String
