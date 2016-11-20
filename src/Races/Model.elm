module Races.Model exposing (Add, Race, initialRaces, Category(..), categoryString)

import Date


type Category
    = Classic
    | Criterium
    | Regiocross
    | Other
    | Unknown


type alias Race =
    { id : Int
    , name :
        String
        --, date : Date.Date
    , date : String
    , category : Category
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
    [ Race 1 "race a" "31-10-2016" Criterium
    , Race 2 "race c" "21-10-2016" Other
    ]


dateFromString : String -> Date.Date
dateFromString dateString =
    case Date.fromString dateString of
        Ok result ->
            result

        Err errMsg ->
            Debug.crash "dateFromString invalid date string"


categoryString : Category -> String
categoryString category =
    case category of
        Classic ->
            "Klassieker"

        Criterium ->
            "Criterum"

        Regiocross ->
            "Regiocross"

        Other ->
            "Other"  

        _ ->
            "Unknown"
