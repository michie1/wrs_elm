module Results.Model exposing (ResultAdd, Result, initial)

type alias Result =
    { id : Int
    , riderId : Int
    , raceId : Int
    , result : String
    }
    

type alias ResultAdd =
    { result : Result
    }    

initial : ResultAdd
initial =
    { result = (Result 0 0 0 "")
    }
