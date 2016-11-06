module Results.Model exposing (ResultAdd, Result, initialAdd, initialResults)

import Riders.Model exposing (Rider)


type alias Result =
    { id : Int
    , riderId : Int
    , raceId : Int
    , result : String
    }


type alias ResultAdd =
    { raceId : Int
    , riderName : String
    , riderId : Int
    , riders : List Rider
    , result : String
    }


initialAdd : ResultAdd
initialAdd =
    { raceId = 0
    , riderId = 0
    , riderName = ""
    , riders = []
    , result = ""
    }


initialResults : List Result
initialResults =
    [ Result 1 1 1 "9000" ]
