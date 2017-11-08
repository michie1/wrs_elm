module Page.Rider.Add.Model exposing (Model)

import Data.Licence exposing (Licence)


type alias Model =
    { name : String
    , licence : Maybe Licence
    }
