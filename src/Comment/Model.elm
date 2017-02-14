module Comment.Model exposing (Comment, Add, empty, initialComments, initialAdd)


type alias Comment =
    { id : Int
    , date : String
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
    , date = "1970-01-01 00:00"
    , raceId = 0
    , riderId = 0
    , text = ""
    }


initialComments : List Comment
initialComments =
    [ Comment 1 "2016-01-13 12:13" 1 1 "Leuk!"
    ]


initialAdd : Add
initialAdd =
    { raceId = 0
    , riderName = ""
    , text = ""
    }
