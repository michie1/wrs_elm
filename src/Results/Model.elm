module Results.Model exposing (ResultAdd, Result, initialAdd, initialResults, ResultCategory, ResultCategory(..), categories)

import Riders.Model exposing (Rider)


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


type alias ResultAdd =
    { raceId : Int
    , riderName : String
    , riders : List Rider
    , result : String
    , category : ResultCategory
    , strava : String
    }


initialAdd : ResultAdd
initialAdd =
    { raceId = 0
    , riderName = ""
    , riders = []
    , result = ""
    , category = Amateurs
    , strava = ""
    }


initialResults : List Result
initialResults =
    [ Result 1 1 1 "9000" CatA Nothing ]


categories : List ResultCategory
categories =
    [ Amateurs
    , Basislidmaatschap
    , CatA
    , CatB
    , Unknown
    ]
