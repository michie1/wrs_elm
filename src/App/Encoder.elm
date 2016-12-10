module App.Encoder exposing (licence)

import Riders.Model exposing (Licence)
import Json.Encode

licence : Maybe Licence -> Json.Encode.Value
licence maybeLicence =
    case maybeLicence of
        Just Riders.Model.Elite ->
            Json.Encode.string "elite"

        Just Riders.Model.Amateurs ->
            Json.Encode.string "amateurs"

        Just Riders.Model.Basislidmaatschap ->
            Json.Encode.string "basislidmaatschap"

        Just Riders.Model.Other ->
            Json.Encode.string "other"

        Nothing ->
            Json.Encode.null

