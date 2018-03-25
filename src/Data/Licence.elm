module Data.Licence exposing (Licence, Licence(..), licenceToString, licence, licenceDecoder)

import Json.Decode


type Licence
    = Elite
    | Amateurs
    | Basislidmaatschap
    | Sportklasse
    | Other


licenceToString : Licence -> String
licenceToString licence =
    case licence of
        Elite ->
            "elite"

        Amateurs ->
            "amateurs"

        Basislidmaatschap ->
            "basislidmaatschap"

        Sportklasse ->
            "sportklasse"

        Other ->
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

        "sportklasse" ->
            Sportklasse

        _ ->
            Other


licenceDecoder : String -> Json.Decode.Decoder Licence
licenceDecoder string =
    Json.Decode.succeed (licence string)
