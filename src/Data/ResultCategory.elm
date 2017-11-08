module Data.ResultCategory exposing (ResultCategory, ResultCategory(..), resultCategories, categoryToString, resultCategoryDecoder)

import Json.Decode


type ResultCategory
    = Amateurs
    | Basislidmaatschap
    | CatA
    | CatB
    | Unknown


resultCategories : List ResultCategory
resultCategories =
    [ Amateurs
    , Basislidmaatschap
    , CatA
    , CatB
    , Unknown
    ]


categoryToString : ResultCategory -> String
categoryToString category =
    case category of
        Amateurs ->
            "amateurs"

        Basislidmaatschap ->
            "basislidmaatschap"

        CatA ->
            "cata"

        CatB ->
            "catb"

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
