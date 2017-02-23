module Result.Model exposing (Add, Result, initialAdd, initialResults, ResultCategory, ResultCategory(..), categories)

import Rider.Model exposing (Rider)


type ResultCategory
    = Amateurs
    | Basislidmaatschap
    | CatA
    | CatB
    | Unknown


type alias Result =
    { id : Int
    , riderId : Int
    , raceId : Int
    , result : String
    , category : ResultCategory
    , strava : Maybe String
    }


type alias Add =
    { raceId : Int
    , riderName : String
    , result : String
    , category : ResultCategory
    , strava : String
    }


initialAdd : Add
initialAdd =
    { raceId = 0
    , riderName = ""
    , result = ""
    , category = Amateurs
    , strava = ""
    }


initialResults : List Result
initialResults =
    []



--[ Result 1 1 1 "9000" CatA Nothing ]


categories : List ResultCategory
categories =
    [ Amateurs
    , Basislidmaatschap
    , CatA
    , CatB
    , Unknown
    ]
