module Data.Rider exposing (Rider)

import Data.Licence exposing (Licence)

type alias Rider =
    { key : String
    , name : String
    , licence : Licence
    }
