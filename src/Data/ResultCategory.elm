module Data.ResultCategory exposing (ResultCategory, ResultCategory(..), resultCategories)

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
