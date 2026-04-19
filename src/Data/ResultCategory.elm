module Data.ResultCategory exposing (ResultCategory(..), categoryReadable, categoryToString, resultCategories, resultCategoryDecoder)

import Json.Decode


type ResultCategory
    = Amateurs
    | Elite
    | Klasse 1
    | Klasse 2
    | Klasse 3
    | Klasse 4
    | Klasse 5
    | CatA
    | EliteAmateurVrouwen
    | CatB
    | CatC
    | CatD
    | Other
    | Unknown


resultCategories : List ResultCategory
resultCategories =
    [ Amateurs
    , Elite
    , Klasse1
    , Klasse2
    , Klasse3
    , Klasse4
    , Klasse5
    , CatA
    , EliteAmateurVrouwen
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

        Klasse1 ->
            "klasse1"

        Klasse2 ->
            "klasse2"

        Klasse3 ->
            "klasse3"

        Klasse4 ->
            "klasse4"

        Klasse5 ->
            "klasse5"

        CatA ->
            "cata

        EliteAmateurVrouwen ->
            "elite_amateur_vrouwen"

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

        Klasse1 ->
            "Klasse 1"

        Klasse2 ->
            "Klasse 2"

        Klasse3 ->
            "Klasse 3"

        Klasse4 ->
            "Klasse 4"

        Klasse5 ->
            "Klasse 5"
            
        CatA ->
            "Cat. a"

        EliteAmateurVrouwen ->
            "Elite/amateur vrouwen"

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
                
             "klasse1" ->
                Klasse1

            "klasse2" ->
                Klasse2
            
            "klasse3" ->
                Klasse3

            "klasse4" ->
                Klasse4

            "klasse5" ->
                Klasse5

            "cata" ->
                CatA

            "elite_amateur_vrouwen" ->
                EliteAmateurVrouwen

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
