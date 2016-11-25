module Results.Model exposing (ResultAdd, Result, initialAdd, initialResults, ResultCategory, ResultCategory(..))

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
    }


type alias ResultAdd =
    { raceId : Int
    , riderName : String
    , riders : List Rider
    , result : String
    , category : ResultCategory
    }


initialAdd : ResultAdd
initialAdd =
    { raceId = 0
    , riderName = ""
    , riders = []
    , result = ""
    , category = Amateurs
    }


initialResults : List Result
initialResults =
    [ Result 1 1 1 "9000" CatA ]
