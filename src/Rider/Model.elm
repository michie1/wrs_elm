module Rider.Model exposing (Rider, Add)

import Data.Licence exposing (Licence)


type alias Rider =
    { key : String
    , name : String
    , licence : Licence
    }


type alias Add =
    { name : String
    , licence : Maybe Licence
    }
