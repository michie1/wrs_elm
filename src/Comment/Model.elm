module Comment.Model exposing (Comment, Add, empty, initialComments, initialAdd)

import Date

type alias Comment =
    { id : Int
    , date : String
    , updatedAt: Maybe Date.Date
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
    , updatedAt = Nothing
    , raceId = 0
    , riderId = 0
    , text = ""
    }


initialComments : List Comment
initialComments =
    [ ]


initialAdd : Add
initialAdd =
    { raceId = 0
    , riderName = ""
    , text = ""
    }
