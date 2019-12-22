port module App.OutsideInfo exposing (InfoForElm(..), InfoForOutside(..), getInfoFromOutside, sendInfoOutside)

import Data.Race exposing (Race, racesDecoder)
import Data.RaceResult exposing (RaceResult, resultDecoder, resultsDecoder)
import Data.Rider exposing (Rider, ridersDecoder)
import Data.User exposing (userDecoder)
import Json.Decode exposing (decodeValue, errorToString)
import Json.Encode


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

        ResultEdit payload ->
            infoForOutside { tag = "ResultEdit", data = payload }

        UserSignOut ->
            infoForOutside { tag = "UserSignOut", data = Json.Encode.bool True }

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
                            onError <| errorToString e

                "RacesLoaded" ->
                    case decodeValue racesDecoder outsideInfo.data of
                        Ok races ->
                            tagger <| RacesLoaded races

                        Err e ->
                            onError <| errorToString e

                "ResultsLoaded" ->
                    case decodeValue resultsDecoder outsideInfo.data of
                        Ok results ->
                            tagger <| ResultsLoaded results

                        Err e ->
                            onError <| errorToString e

                "RaceAdded" ->
                    case decodeValue Json.Decode.string outsideInfo.data of
                        Ok key ->
                            tagger <| RaceAdded key

                        Err e ->
                            onError <| errorToString e

                "RiderAdded" ->
                    case decodeValue Json.Decode.string outsideInfo.data of
                        Ok key ->
                            tagger <| RiderAdded key

                        Err e ->
                            onError <| errorToString e

                "ResultAdded" ->
                    case decodeValue resultDecoder outsideInfo.data of
                        Ok response ->
                            tagger <| ResultAdded response.raceKey

                        Err e ->
                            onError <| errorToString e

                "ResultEdited" ->
                    case decodeValue Json.Decode.string outsideInfo.data of
                        Ok raceKey ->
                            tagger <| ResultEdited raceKey

                        Err e ->
                            onError <| errorToString e

                "UserLoaded" ->
                    case decodeValue userDecoder outsideInfo.data of
                        Ok response ->
                            tagger <| UserLoaded response.email

                        Err e ->
                            onError <| errorToString e

                "UserSignedOut" ->
                    tagger <| UserSignedOut

                tag ->
                    onError <| "Unexpected tag from outside: " ++ tag
        )


type InfoForOutside
    = RaceAdd Json.Encode.Value
    | RiderAdd Json.Encode.Value
    | ResultAdd Json.Encode.Value
    | ResultEdit Json.Encode.Value
    | UserSignOut
    | LogError String


type InfoForElm
    = RidersLoaded (List Rider)
    | RacesLoaded (List Race)
    | ResultsLoaded (List RaceResult)
    | RaceAdded String
    | RiderAdded String
    | ResultAdded String
    | ResultEdited String
    | UserLoaded String
    | UserSignedOut


type alias GenericOutsideData =
    { tag : String
    , data : Json.Encode.Value
    }
