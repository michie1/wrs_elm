module Races.Model exposing (RaceAdd, Race, initial)

type alias RaceAdd =
    { race : Race
    }


initial : RaceAdd
initial =
    { race = (Race 0 "Initial")
    }

type alias Race =
    { id : Int
    , name : String
    }
