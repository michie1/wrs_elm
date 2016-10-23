module Results.Model exposing (ResultAdd, Result, empty, initialResults)

import Riders.Model exposing (Rider)

type alias Result =
    { id : Int
    , riderId : Int
    , raceId : Int
    , result : String
    }
    

type alias ResultAdd =
    { result : Result
    , riderName : String
    , riders : List Rider
    }    

empty : ResultAdd
empty =
    { result = (Result 0 0 0 "")
    , riderName = ""
    , riders = []
    }

initialResults : List Result
initialResults =    
    [ Result 1 1 1 "9000" ]
