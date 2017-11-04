module Page.Rider.Model exposing (Add)

import Data.Licence exposing (Licence)


type alias Add =
    { name : String
    , licence : Maybe Licence
    }
