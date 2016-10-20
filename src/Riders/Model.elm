module Riders.Model exposing (RiderAdd, Rider, initial)

type alias Rider =
    { id : Int
    , name : String
    , licence : String
    }
    

type alias RiderAdd =
    { rider : Rider
    }    

initial : RiderAdd
initial =
    { rider = (Rider 0 "Initial" "")
    }
