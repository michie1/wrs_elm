port module App.OutsideInfo exposing (sendInfoOutside, InfoForOutside, InfoForOutside(..), InfoForElm, InfoForElm(..), getInfoFromOutside)

import Json.Encode
import Json.Decode exposing (decodeValue)
import Data.Rider exposing (Rider, ridersDecoder)
import Data.Race exposing (Race, racesDecoder)
import Data.RaceResult exposing (RaceResult, resultsDecoder, resultDecoder)


port infoForOutside : GenericOutsideData -> Cmd msg


port infoForElm : (GenericOutsideData -> msg) -> Sub msg


sendInfoOutside : InfoForOutside -> Cmd msg
sendInfoOutside info =
    case info of
        RaceAdd payload ->
            infoForOutside { tag = "RaceAdd", data = payload }

        RiderAdd payload ->
            infoForOutside { tag = "RiderAdd", data = payload }

        ResultAdd payload ->
            infoForOutside { tag = "ResultAdd", data = payload }

        LogError err ->
            infoForOutside { tag = "LogError", data = Json.Encode.string err }


getInfoFromOutside : (InfoForElm -> msg) -> (String -> msg) -> Sub msg
getInfoFromOutside tagger onError =
    infoForElm
        (\outsideInfo ->
            case outsideInfo.tag of
                "RidersLoaded" ->
                    case decodeValue ridersDecoder outsideInfo.data of
                        Ok riders ->
                            tagger <| RidersLoaded riders

                        Err e ->
                            onError e

                "RacesLoaded" ->
                    case decodeValue racesDecoder outsideInfo.data of
                        Ok races ->
                            tagger <| RacesLoaded races

                        Err e ->
                            onError e

                "ResultsLoaded" ->
                    case decodeValue resultsDecoder outsideInfo.data of
                        Ok results ->
                            tagger <| ResultsLoaded results

                        Err e ->
                            onError e

                "RaceAdded" ->
                    case decodeValue Json.Decode.string outsideInfo.data of
                        Ok key ->
                            tagger <| RaceAdded key

                        Err e ->
                            onError e

                "RiderAdded" ->
                    case decodeValue Json.Decode.string outsideInfo.data of
                        Ok key ->
                            tagger <| RiderAdded key

                        Err e ->
                            onError e

                "ResultAdded" ->
                    case decodeValue resultDecoder outsideInfo.data of
                        Ok response ->
                            tagger <| ResultAdded response.raceKey

                        Err e ->
                            onError e

                _ ->
                    onError <| "Unexpected info from outside: " ++ toString outsideInfo
        )


type InfoForOutside
    = RaceAdd Json.Encode.Value
    | RiderAdd Json.Encode.Value
    | ResultAdd Json.Encode.Value
    | LogError String


type InfoForElm
    = RidersLoaded (List Rider)
    | RacesLoaded (List Race)
    | ResultsLoaded (List RaceResult)
    | RaceAdded String
    | RiderAdded String
    | ResultAdded String


type alias GenericOutsideData =
    { tag : String
    , data : Json.Encode.Value
    }
