module Race.Model exposing (Add, Race, initialRaces, Category, Category(..), categoryString)

import Date


type Category
    = Classic
    | Criterium
    | Regiocross
    | Other
    | Unknown


type alias Race =
    { id : Int
    , name : String
    , date : String
    , category : Maybe Category
    }


type alias Add =
    { name : String
    , dateString : String
    , category : Maybe Category
    }


initialRaces : List Race
initialRaces =
    [ Race 1 "race a" "31-10-2016" (Just Criterium)
    , Race 2 "race c" "21-10-2016" (Just Other)
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
