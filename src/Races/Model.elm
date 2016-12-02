module Races.Model exposing (Add, Race, initialRaces, Category, Category(..), categoryString)

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
    , date : String
    , category : Category
    }


type alias Add =
    { name : String
    , dateString : Maybe String
    , category : Category
    }


initialRaces : List Race
initialRaces =
    [ Race 1 "race a" "31-10-2016" Criterium
    , Race 2 "race c" "21-10-2016" Other
    ]


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
