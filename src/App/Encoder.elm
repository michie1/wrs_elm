module App.Encoder exposing (licence)

import Rider.Model exposing (Licence)
import Json.Encode

licence : Maybe Licence -> Json.Encode.Value
licence maybeLicence =
    case maybeLicence of
        Just Rider.Model.Elite ->
            Json.Encode.string "elite"

        Just Rider.Model.Amateurs ->
            Json.Encode.string "amateurs"

        Just Rider.Model.Basislidmaatschap ->
            Json.Encode.string "basislidmaatschap"

        Just Rider.Model.Other ->
            Json.Encode.string "other"

        Nothing ->
            Json.Encode.null

