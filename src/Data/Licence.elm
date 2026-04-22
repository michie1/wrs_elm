module Data.Licence exposing (Licence(..), licences, licenceDecoder, licenceLabel, licenceToString, parseLicence, selectableLicences)

import Json.Decode


type Licence
    = Elite
    | Amateurs
    | Basislidmaatschap
    | Basic
    | Plus
    | Premium
    | Sportklasse
    | Other


licences : List Licence
licences =
    [ Elite
    , Amateurs
    , Basislidmaatschap
    , Basic
    , Plus
    , Premium
    , Sportklasse
    , Other
    ]


selectableLicences : List Licence
selectableLicences =
    [ Basic
    , Plus
    , Premium
    , Other
    ]


licenceLabel : Licence -> String
licenceLabel licence =
    case licence of
        Elite ->
            "Elite-old"

        Amateurs ->
            "Amateurs-old"

        Basislidmaatschap ->
            "Basislidmaatschap-old"

        Basic ->
            "Basic"

        Plus ->
            "Plus"

        Premium ->
            "Premium"

        Sportklasse ->
            "Sportklasse-old"

        Other ->
            "Other"


licenceToString : Licence -> String
licenceToString licence =
    case licence of
        Elite ->
            "elite"

        Amateurs ->
            "amateurs"

        Basislidmaatschap ->
            "basislidmaatschap"

        Basic ->
            "basic"

        Plus ->
            "plus"

        Premium ->
            "premium"

        Sportklasse ->
            "sportklasse"

        Other ->
            "other"


parseLicence : String -> Licence
parseLicence string =
    case string of
        "elite" ->
            Elite

        "amateurs" ->
            Amateurs

        "basislidmaatschap" ->
            Basislidmaatschap

        "basic" ->
            Basic

        "plus" ->
            Plus

        "premium" ->
            Premium

        "sportklasse" ->
            Sportklasse

        _ ->
            Other


licenceDecoder : String -> Json.Decode.Decoder Licence
licenceDecoder string =
    Json.Decode.succeed (parseLicence string)
