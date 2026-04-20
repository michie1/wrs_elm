module Data.Licence exposing (Licence(..), licenceDecoder, licenceToString, parseLicence)

import Json.Decode


type Licence
    = Elite
    | Basis
    | Plus
    | Premium
    | Other


licenceToString : Licence -> String
licenceToString licence =
    case licence of
        Elite ->
            "elite"

        Basis ->
            "basis"

        Plus ->
            "plus"

        Premium ->
            "premium"

        Other ->
            "other"


parseLicence : String -> Licence
parseLicence string =
    case string of
        "elite" ->
            Elite

        "basis" ->
            Basis

        "plus" ->
            Plus

        "premium" ->
            Premium

        _ ->
            Other


licenceDecoder : String -> Json.Decode.Decoder Licence
licenceDecoder string =
    Json.Decode.succeed (parseLicence string)
