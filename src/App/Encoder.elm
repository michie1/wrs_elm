module App.Encoder exposing (licence, raceCategory, resultCategory, resultOutfit)

import Rider.Model exposing (Licence)
import Json.Encode
import Race.Model
import Result.Model


licence : Maybe Licence -> Json.Encode.Value
licence maybeLicence =
    case maybeLicence of
        Just (Rider.Model.Elite) ->
            Json.Encode.string "elite"

        Just (Rider.Model.Amateurs) ->
            Json.Encode.string "amateurs"

        Just (Rider.Model.Basislidmaatschap) ->
            Json.Encode.string "basislidmaatschap"

        Just (Rider.Model.Other) ->
            Json.Encode.string "other"

        Nothing ->
            Json.Encode.null


raceCategory : Race.Model.Category -> Json.Encode.Value
raceCategory category =
    case category of
        Race.Model.Classic ->
            Json.Encode.string "classic"

        Race.Model.Criterium ->
            Json.Encode.string "criterium"

        Race.Model.Regiocross ->
            Json.Encode.string "regiocross"

        Race.Model.Other ->
            Json.Encode.string "other"

        Race.Model.Unknown ->
            Json.Encode.string "unknown"


resultCategory : Result.Model.ResultCategory -> Json.Encode.Value
resultCategory category =
    case category of
        Result.Model.Amateurs ->
            Json.Encode.string "amateurs"

        Result.Model.Basislidmaatschap ->
            Json.Encode.string "basislidmaatschap"

        Result.Model.CatA ->
            Json.Encode.string "cata"

        Result.Model.CatB ->
            Json.Encode.string "catb"

        Result.Model.Unknown ->
            Json.Encode.string "unknown"

resultOutfit : Result.Model.Outfit -> Json.Encode.Value
resultOutfit outfit =
    case outfit of
        Result.Model.WTOS ->
            Json.Encode.string "wtos"

        Result.Model.WASP ->
            Json.Encode.string "wasp"

        Result.Model.Other ->
            Json.Encode.string "other"
