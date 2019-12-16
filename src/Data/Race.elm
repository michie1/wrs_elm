module Data.Race exposing (Race, getRace, lastRaces, racesDecoder)

import Data.RaceType exposing (RaceType, raceTypeDecoder)
import Date exposing (Date)
import Iso8601
import Json.Decode
import Json.Decode.Pipeline
import Time exposing (Posix)


type alias Race =
    { key : String
    , name : String
    , date : Posix
    , raceType : RaceType
    }


lastRaces : List Race -> List Race
lastRaces races =
    -- TODO: compare by date |> List.sortWith (\a b -> Date.Extra.compare a.date b.date)
    races
        |> List.reverse
        |> List.take 5


getRace : String -> List Race -> Maybe Race
getRace raceKey races =
    List.head
        (List.filter
            (\race -> race.key == raceKey)
            races
        )


raceDecoder : Json.Decode.Decoder Race
raceDecoder =
    Json.Decode.map4
        Race
        (Json.Decode.field "key" Json.Decode.string)
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "date" Iso8601.decoder)
        (Json.Decode.field "category"
            (Json.Decode.andThen raceTypeDecoder Json.Decode.string)
        )


racesDecoder : Json.Decode.Decoder (List Race)
racesDecoder =
    Json.Decode.list raceDecoder
