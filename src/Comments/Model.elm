module Comments.Model exposing (Comment, Add, empty, initialComments, initialAdd)


type alias Comment =
    { id : Int
    , raceId : Int
    , riderId : Int
    , text : String
    }


type alias Add =
    { raceId : Int
    , riderName : String
    , text : String
    }


empty : Comment
empty =
    { id = 0
    , raceId = 0
    , riderId = 0
    , text = ""
    }


initialComments : List Comment
initialComments =
    [ Comment 1 1 1 "Leuk!"
    ]


--initialAdd : { riderIndex : Int, raceId : Int, text : String }
initialAdd : Add
initialAdd =
    { raceId = 0
    , riderName = "" 
    , text = ""
    }
