module Data.RaceType exposing (RaceType, RaceType(..), raceType, raceTypeToString, raceTypeDecoder, getPointsByRaceType, raceTypeReadable, raceTypes)

import Json.Decode


type RaceType
    = Trainingskoers
    | Criterium
    | Zomoco
    | Classic
    | Cross
    | Beach
    | Omloop
    | Studentscup
    | CK
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
    , Cross
    , Beach
    , Omloop
    , Studentscup
    , CK
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

        "cross" ->
            Cross

        "beach" ->
            Beach

        "omloop" ->
            Omloop

        "studentencup" ->
            Studentscup

        "CK" ->
            CK

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

        Cross ->
            "cross"

        Beach ->
            "beach"

        Omloop ->
            "omloop"

        Studentscup ->
            "studentencup"

        CK ->
            "CK"

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

        Cross ->
            "Cross"

        Beach ->
            "Beachrace"

        Omloop ->
            "Omloop"

        Studentscup ->
            "Studentencup"

        CK ->
            "Clubkampioenschap"

        NK ->
            "Nederlands kampioenschap"

        Cyclosportive ->
            "Cyclosportive"

        TimeTrial ->
            "Time trial"

        Toertocht ->
            "Toertocht"

        _ ->
            "Other"


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

        Cross ->
            2

        Beach ->
            3

        Omloop ->
            4

        Studentscup ->
            3

        CK ->
            2

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
