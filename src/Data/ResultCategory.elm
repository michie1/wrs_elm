module Data.ResultCategory exposing (ResultCategory, ResultCategory(..), resultCategories, categoryToString, resultCategoryDecoder, categoryReadable)

import Json.Decode


type ResultCategory
    = Amateurs
    | Elite
    | CatA
    | EliteAmateurs
    | Basislidmaatschap
    | Sportklasse
    | CatB
    | CatC
    | CatD
    | Other
    | Unknown


resultCategories : List ResultCategory
resultCategories =
    [ Amateurs
    , Elite
    , CatA
    , Basislidmaatschap
    , EliteAmateurs
    , Sportklasse
    , CatB
    , CatC
    , CatD
    , Other
    ]


categoryToString : ResultCategory -> String
categoryToString category =
    case category of
        Amateurs ->
            "amateurs"

        Elite ->
            "elite"

        CatA ->
            "cata"

        Basislidmaatschap ->
            "basislidmaatschap"

        EliteAmateurs ->
            "elite_amateurs"

        Sportklasse ->
            "sportklasse"

        CatB ->
            "catb"

        CatC ->
            "catc"

        CatD ->
            "catd"

        Other ->
            "other"

        Unknown ->
            "unknown"


categoryReadable : ResultCategory -> String
categoryReadable category =
    case category of
        Amateurs ->
            "Amateurs"

        Elite ->
            "Elite"

        CatA ->
            "Cat. a"

        Basislidmaatschap ->
            "Basislidmaatschap"

        EliteAmateurs ->
            "Elite/amateurs"

        Sportklasse ->
            "sportklasse"

        CatB ->
            "Cat. b"

        CatC ->
            "Cat. c"

        CatD ->
            "Cat. d"

        Other ->
            "Other"

        Unknown ->
            "Unknown"


resultCategoryDecoder : String -> Json.Decode.Decoder ResultCategory
resultCategoryDecoder string =
    Json.Decode.succeed <|
        case string of
            "amateurs" ->
                Amateurs

            "elite" ->
                Elite

            "cata" ->
                CatA

            "basislidmaatschap" ->
                Basislidmaatschap

            "elite/amateurs" ->
                EliteAmateurs

            "sportklasse" ->
                Sportklasse

            "catb" ->
                CatB

            "catc" ->
                CatC

            "catd" ->
                CatD

            "other" ->
                Other

            _ ->
                Unknown
