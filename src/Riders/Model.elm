module Riders.Model exposing (RiderAdd, Rider, empty, initialRiders)


type alias Rider =
    { id : Int
    , name : String
    , licence : String
    }


type alias RiderAdd =
    { rider : Rider
    }


empty : RiderAdd
empty =
    { rider = (Rider 0 "empty" "")
    }


initialRiders : List Rider
initialRiders =
    [ Rider 1 "Michiel" "Elite"
    , Rider 2 "Henk" "Amateur"
    ]
