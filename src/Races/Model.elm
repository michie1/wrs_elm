module Races.Model exposing (RaceAdd, Race, empty, initialRaces)

type alias Race =
    { id : Int
    , name : String
    }

type alias RaceAdd =
    { race : Race
    }


empty : RaceAdd
empty =
    { race = Race 0 "empty"
    }

initialRaces : List Race
initialRaces =
    [ Race 1 "race a"
    , Race 2 "race c"
    ]
