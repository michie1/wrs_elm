module Data.RaceResult exposing (RaceResult, getPointsByResult, getPointsByResults, resultDecoder, resultExists, resultsDecoder)

import Data.Outfit as Outfit exposing (Outfit, outfitDecoder)
import Data.Race exposing (Race, getRace)
import Data.RaceType exposing (getPointsByRaceType)
import Data.ResultCategory exposing (ResultCategory, resultCategoryDecoder)
import Json.Decode
import Json.Decode.Pipeline


type alias RaceResult =
    { key : String
    , riderKey : String
    , raceKey : String
    , result : String
    , category : ResultCategory
    , outfit : Outfit
    }


resultExists : RaceResult -> List RaceResult -> Bool
resultExists result results =
    List.length
        (List.filter
            (\r -> r.raceKey == result.raceKey && r.riderKey == result.riderKey)
            results
        )
        /= 0


resultDecoder : Json.Decode.Decoder RaceResult
resultDecoder =
    Json.Decode.Pipeline.decode RaceResult
        |> Json.Decode.Pipeline.required "key" Json.Decode.string
        |> Json.Decode.Pipeline.required "riderKey" Json.Decode.string
        |> Json.Decode.Pipeline.required "raceKey" Json.Decode.string
        |> Json.Decode.Pipeline.required "result" Json.Decode.string
        |> Json.Decode.Pipeline.required "category"
            (Json.Decode.string
                |> Json.Decode.andThen resultCategoryDecoder
            )
        |> Json.Decode.Pipeline.required "outfit"
            (Json.Decode.string
                |> Json.Decode.andThen outfitDecoder
            )


resultsDecoder : Json.Decode.Decoder (List RaceResult)
resultsDecoder =
    Json.Decode.list resultDecoder


getPointsByResults : List RaceResult -> List Race -> Int
getPointsByResults results races =
    List.sum <|
        List.map
            (\result -> getPointsByResult result races)
            results


getPointsByResult : RaceResult -> List Race -> Int
getPointsByResult result races =
    if result.outfit == Outfit.WTOS then
        case getRace result.raceKey races of
            Just race ->
                getPointsByRaceType race.raceType

            Nothing ->
                0

    else
        0
