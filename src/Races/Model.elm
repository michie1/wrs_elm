module Races.Model exposing (Add, Race, empty, initialRaces)


type alias Race =
    { id : Int
    , name : String
    }


type alias Add =
    { name : String
    , date : String
    }


empty : Add
empty =
    { name = ""
    , date = "date"
    }


initialRaces : List Race
initialRaces =
    [ Race 1 "race a"
    , Race 2 "race c"
    ]
