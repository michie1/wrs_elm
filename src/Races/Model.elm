module Races.Model exposing (Add, Race, initialRaces)

import Date

type alias Race =
    { id : Int
    , name : String
    --, date : Date.Date
    , date : String
    }


type alias Add =
    { name : String
    , dateString : String
    }


{--
empty : Add
empty =
    { name = ""
    , date = "date"
    }
--}


initialRaces : List Race
initialRaces =
    [ Race 1 "race a" "05-11-2016" -- (dateFromString "2016-11-01")
    , Race 2 "race c" "06-11-2016" -- (dateFromString "2016-10-01")
    ]

dateFromString : String -> Date.Date
dateFromString dateString =
    case Date.fromString dateString of
        Ok result ->
            result

        Err errMsg ->
            Debug.crash "dateFromString invalid date string"
