module Rider.Model exposing (RiderAdd, Rider, empty, initialRiders, Licence, Licence(..))


type Licence
    = Elite
    | Amateurs
    | Basislidmaatschap
    | Other


type alias Rider =
    { id : Int
    , name : String
    , licence : Maybe Licence
    }


type alias RiderAdd =
    { rider : Rider
    }


empty : RiderAdd
empty =
    { rider = (Rider 0 "empty" (Just Other))
    }


initialRiders : List Rider
initialRiders =
    [ Rider 1 "Michiel" (Just Elite)
    , Rider 2 "Henk" (Just Amateurs)
    ]
