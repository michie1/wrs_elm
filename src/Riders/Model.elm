module Riders.Model exposing (RiderAdd, Rider, empty, initialRiders, Licence, Licence(..))


type Licence 
    = Elite
    | Amateurs
    | Basislidmaatschap
    | Other

type alias Rider =
    { id : Int
    , name : String
    , licence : Licence
    }


type alias RiderAdd =
    { rider : Rider
    }


empty : RiderAdd
empty =
    { rider = (Rider 0 "empty" Other)
    }


initialRiders : List Rider
initialRiders =
    [ Rider 1 "Michiel" Elite
    , Rider 2 "Henk" Amateurs
    ]
