module Data.Licence exposing (Licence, Licence(..), licenceToString, licence, licenceDecoder)

import Json.Decode


type Licence
    = Elite
    | Amateurs
    | Basislidmaatschap
    | Other


licenceToString : Maybe Licence -> String
licenceToString maybeLicence =
    case maybeLicence of
        Just Elite ->
            "elite"

        Just Amateurs ->
            "amateurs"

        Just Basislidmaatschap ->
            "basislidmaatschap"

        Just Other ->
            "other"

        Nothing ->
            "other"


licence : String -> Licence
licence string =
    case string of
        "elite" ->
            Elite

        "amateurs" ->
            Amateurs

        "basislidmaatschap" ->
            Basislidmaatschap

        _ ->
            Other


licenceDecoder : String -> Json.Decode.Decoder Licence
licenceDecoder string =
    Json.Decode.succeed (licence string)
