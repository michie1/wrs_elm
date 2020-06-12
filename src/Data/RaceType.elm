module Data.RaceType exposing (RaceType(..), getPointsByRaceType, raceType, raceTypeDecoder, raceTypeDescription, raceTypeReadable, raceTypeToString, raceTypes)

import Json.Decode


type RaceType
    = Trainingskoers
    | Criterium
    | Zomoco
    | Classic
    | OffRoadRegional
    | OffRoadNational
    | Omloop
    | Studentscup
    | WTOS
    | NK
    | Cyclosportive
    | TimeTrial
    | Toertocht
    | Other
    | Unknown


raceTypes : List RaceType
raceTypes =
    [ Trainingskoers
    , Criterium
    , Zomoco
    , Classic
    , OffRoadRegional
    , OffRoadNational
    , Omloop
    , Studentscup
    , WTOS
    , NK
    , Cyclosportive
    , TimeTrial
    , Toertocht
    , Other
    ]


raceType : String -> RaceType
raceType string =
    case string of
        "trainingskoers" ->
            Trainingskoers

        "criterium" ->
            Criterium

        "zomoco" ->
            Zomoco

        "classic" ->
            Classic

        "offRoadRegional" ->
            OffRoadRegional

        "offRoadNational" ->
            OffRoadNational

        "omloop" ->
            Omloop

        "studentencup" ->
            Studentscup

        "wtos" ->
            WTOS

        "NK" ->
            NK

        "cyclosportive" ->
            Cyclosportive

        "timetrial" ->
            TimeTrial

        "toertocht" ->
            Toertocht

        "other" ->
            Other

        _ ->
            Other


raceTypeToString : RaceType -> String
raceTypeToString category =
    case category of
        Trainingskoers ->
            "trainingskoers"

        Criterium ->
            "criterium"

        Zomoco ->
            "zomoco"

        Classic ->
            "classic"

        OffRoadRegional ->
            "offRoadRegional"

        OffRoadNational ->
            "offRoadNational"

        Omloop ->
            "omloop"

        Studentscup ->
            "studentencup"

        WTOS ->
            "wtos"

        NK ->
            "NK"

        Cyclosportive ->
            "cyclosportive"

        TimeTrial ->
            "timetrial"

        Toertocht ->
            "toertocht"

        _ ->
            "other"


raceTypeReadable : RaceType -> String
raceTypeReadable category =
    case category of
        Trainingskoers ->
            "Trainingskoers"

        Criterium ->
            "Criterium"

        Zomoco ->
            "ZoMoCo"

        Classic ->
            "Klassieker"

        OffRoadRegional ->
            "Off-road Regionaal"

        OffRoadNational ->
            "Off-road Nationaal"

        Omloop ->
            "Omloop"

        Studentscup ->
            "Studentencup"

        WTOS ->
            "Interne WTOS-wedstrijd"

        NK ->
            "NK/NCK/NSK"

        Cyclosportive ->
            "Cyclosportive/Marathon"

        TimeTrial ->
            "Time trial"

        Toertocht ->
            "(veld)Toertocht"

        _ ->
            "Other"


raceTypeDescription : RaceType -> Maybe String
raceTypeDescription category =
    case category of
        OffRoadRegional ->
            Just "regiocross, regionale MTB, beach niet-topcompetitie"

        OffRoadNational ->
            Just "nationale cross, nationale MTB, beach topcompetitie"

        WTOS ->
            Just "La Ultimo, La Duo, La Una, CK’s, maandelijkse 10k"

        _ ->
            Nothing


raceTypeDecoder : String -> Json.Decode.Decoder RaceType
raceTypeDecoder string =
    Json.Decode.succeed (raceType string)


getPointsByRaceType : RaceType -> Int
getPointsByRaceType category =
    case category of
        Trainingskoers ->
            1

        Criterium ->
            3

        Zomoco ->
            2

        Classic ->
            4

        OffRoadRegional ->
            2

        OffRoadNational ->
            3

        Omloop ->
            4

        Studentscup ->
            3

        WTOS ->
            1

        NK ->
            5

        Cyclosportive ->
            4

        TimeTrial ->
            3

        Toertocht ->
            2

        Other ->
            0

        Unknown ->
            0
