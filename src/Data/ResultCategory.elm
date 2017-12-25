module Data.ResultCategory exposing (ResultCategory, ResultCategory(..), resultCategories, categoryToString, resultCategoryDecoder, categoryReadable)

import Json.Decode


type ResultCategory
    = Amateurs
    | Elite
    | CatA
    | EliteAmateurs
    | Basislidmaatschap
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
            "amateurs"

        Elite ->
            "elite"

        CatA ->
            "cat. a"

        Basislidmaatschap ->
            "basislidmaatschap"

        EliteAmateurs ->
            "elite/amateurs"

        CatB ->
            "cat. b"

        CatC ->
            "cat. c"

        CatD ->
            "cat. d"

        Other ->
            "other"

        Unknown ->
            "unknown"

resultCategoryDecoder : String -> Json.Decode.Decoder ResultCategory
resultCategoryDecoder string =
    case string of
        "amateurs" ->
            Json.Decode.succeed Amateurs

        "basislidmaatschap" ->
            Json.Decode.succeed Basislidmaatschap

        "cata" ->
            Json.Decode.succeed CatA

        "catb" ->
            Json.Decode.succeed CatB

        "unknown" ->
            Json.Decode.succeed Unknown

        _ ->
            Json.Decode.succeed Unknown
