module Data.Rider exposing (Rider, getRiderById, ridersDecoder, getPointsByRiderId)

import Json.Decode
import Data.Licence exposing (Licence, licenceDecoder)
import Data.Race exposing (Race)
import Data.RaceResult exposing (RaceResult, getPointsByResults)


type alias Rider =
    { key : String
    , name : String
    , licence : Licence
    }


getRiderById : String -> List Rider -> Maybe Rider
getRiderById key riders =
    List.head
        (List.filter
            (\rider -> rider.key == key)
            riders
        )


rider : Json.Decode.Decoder Rider
rider =
    Json.Decode.map3
        Rider
        (Json.Decode.field "key" Json.Decode.string)
        (Json.Decode.field "name" Json.Decode.string)
        (Json.Decode.field "licence"
            (Json.Decode.andThen licenceDecoder Json.Decode.string)
        )


ridersDecoder : Json.Decode.Decoder (List Rider)
ridersDecoder =
    Json.Decode.list rider


getPointsByRiderId : String -> List RaceResult -> List Race -> Int
getPointsByRiderId riderKey results races =
    getPointsByResults
        ((List.filter
            (\result -> result.riderKey == riderKey)
            results
         )
        )
        races


getRiderByName : String -> List Rider -> Maybe Rider
getRiderByName name riders =
    List.head (List.filter (\rider -> rider.name == name) riders)


getRiderByLowerCaseName : String -> List Rider -> Maybe Rider
getRiderByLowerCaseName name riders =
    List.head (List.filter (\rider -> (String.toLower rider.name) == (String.toLower name)) riders)


getRiderByResultId : String -> List Rider -> Maybe Rider
getRiderByResultId key riders =
    List.head (List.filter (\rider -> rider.key == key) riders)
