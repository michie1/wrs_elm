module Data.Rider exposing (Rider, getRiderById)

import Data.Licence exposing (Licence)


type alias Rider =
    { key : String
    , name : String
    , licence : Licence
    }


getRiderById : String -> List Rider -> Maybe Rider
getRiderById key riders =
    List.head
        (List.filter
            (\rider -> rider.key == key)
            riders
        )
