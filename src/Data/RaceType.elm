module Data.RaceType exposing (RaceType, RaceType(..), raceType, raceTypeToString, raceTypeDecoder, getPointsByRaceType, raceTypeReadable, raceTypes)

import Json.Decode


type RaceType
    = Trainingskoers
    | Criterium
    | Zomoco
    | Classic
    | Cross
    | Omloop
    | Studentscup
    | CK
    | NK
    | Cyclosportive
    | Other
    | Unknown

raceTypes =
    [ Trainingskoers
    , Criterium
    , Zomoco
    , Classic
    , Cross
    , Omloop
    , Studentscup
    , CK
    , NK
    , Cyclosportive
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

        _ ->
            "other"

raceTypeReadable : RaceType -> String
raceTypeReadable category =
    case category of
        Trainingskoers ->
            "trainingskoers"

        Criterium ->
            "criterium"

        Zomoco ->
            "ZoMoCo"

        Classic ->
            "klassieker"

        Cross ->
            "cross"

        Omloop ->
            "omloop"

        Studentscup ->
            "studentencup"

        CK ->
            "Clubkampioenschap"

        NK ->
            "Nederlands kampioenschap"

        Cyclosportive ->
            "Cyclosportive"

        _ ->
            "other"

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
            3

        Cross ->
            2

        Omloop ->
            4

        Studentscup ->
            3

        CK ->
            4

        NK ->
            5

        Cyclosportive ->
            4

        Other ->
            0

        Unknown ->
            1
