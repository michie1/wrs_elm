module Data.Race exposing (Race, lastRaces, getRace)

import Html exposing (Html)
import Date exposing (Date)
import Date.Extra
import Data.RaceType exposing (RaceType)

type alias Race =
    { key : String
    , name : String
    , date : Date
    , raceType : RaceType
    }
    
lastRaces : Maybe (List Race) -> List Race
lastRaces maybeRaces =
    Maybe.withDefault [] maybeRaces
        |> List.sortWith (\a b -> Date.Extra.compare a.date b.date)
        |> List.reverse
        |> List.take 5

getRace : String -> List Race -> Maybe Race
getRace raceKey races =
    List.head
        (List.filter
            (\race -> race.key == raceKey)
            races
        )
