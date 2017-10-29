module App.Decoder exposing (riderDecoder)

import Rider.Model
import Json.Decode
import Json.Decode.Extra
import Json.Decode.Pipeline

licenceDecoder : String -> Json.Decode.Decoder Rider.Model.Licence
licenceDecoder string =
    case string of
        "elite" ->
            Json.Decode.succeed Rider.Model.Elite

        "amateurs" ->
            Json.Decode.succeed Rider.Model.Amateurs

        "basislidmaatschap" ->
            Json.Decode.succeed Rider.Model.Basislidmaatschap

        "other" ->
            Json.Decode.succeed Rider.Model.Other

        _ ->
            Json.Decode.succeed Rider.Model.Other


riderDecoder : Json.Decode.Decoder Rider.Model.Rider
riderDecoder =
    Json.Decode.Pipeline.decode Rider.Model.Rider
        |> Json.Decode.Pipeline.required "key" Json.Decode.string
        |> Json.Decode.Pipeline.required "name" Json.Decode.string
        |> Json.Decode.Pipeline.required "licence"
            (Json.Decode.string
                |> Json.Decode.andThen licenceDecoder
            )
