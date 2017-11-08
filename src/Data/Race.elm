module Data.Race exposing (Race, lastRaces, getRace, racesDecoder)

import Html exposing (Html)
import Date exposing (Date)
import Date.Extra
import Json.Decode
import Json.Decode.Extra
import Data.RaceType exposing (RaceType, raceTypeDecoder)


type alias Race =
    { key : String
    , name : String
    , date : Date
    , raceType : RaceType
    }


lastRaces : List Race -> List Race
lastRaces races =
    races
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


race : Json.Decode.Decoder Race
race =
    Json.Decode.map4
        Race
        (Json.Decode.field "key" Json.Decode.string)
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "date" Json.Decode.Extra.date)
        (Json.Decode.field "category"
            (Json.Decode.andThen raceTypeDecoder Json.Decode.string)
        )


racesDecoder : Json.Decode.Decoder (List Race)
racesDecoder =
    Json.Decode.list race
