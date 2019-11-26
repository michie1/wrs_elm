module Data.ResultCategory exposing (ResultCategory(..), categoryReadable, categoryToString, resultCategories, resultCategoryDecoder)

import Json.Decode


type ResultCategory
    = Amateurs
    | Elite
    | CatA
    | Basislidmaatschap
    | EliteAmateurs
    | EliteAmateurVrouwen
    | AmateursSportklasse
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
    , EliteAmateurVrouwen
    , AmateursSportklasse
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

        EliteAmateurVrouwen ->
            "elite_amateur_vrouwen"

        AmateursSportklasse ->
            "amateurs_sportklasse"

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

        EliteAmateurVrouwen ->
            "Elite/amateur vrouwen"

        AmateursSportklasse ->
            "Amateurs/sportklasse"

        Sportklasse ->
            "Sportklasse"

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

            "elite_amateurs" ->
                EliteAmateurs

            "elite_amateur_vrouwen" ->
                EliteAmateurVrouwen

            "amateurs_sportklasse" ->
                AmateursSportklasse

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
