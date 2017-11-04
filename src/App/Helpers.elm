module App.Helpers exposing (..)

import Rider.Model
import Date
import Array
import Navigation
import App.Msg
import App.Routing
import Result.Model
import App.Page
import Data.Outfit as Outfit
import Data.RaceType as RaceType exposing (RaceType)
import Data.Race exposing (Race)


navigate : App.Page.Page -> Cmd App.Msg.Msg
navigate page =
    Navigation.newUrl <| App.Routing.url page


updateRiderLicence : String -> Rider.Model.Licence -> List Rider.Model.Rider -> List Rider.Model.Rider
updateRiderLicence riderKey licence riders =
    List.map
        (\rider ->
            case rider.key == riderKey of
                True ->
                    { rider | licence = licence }

                False ->
                    rider
        )
        riders


getRiderByName : String -> List Rider.Model.Rider -> Maybe Rider.Model.Rider
getRiderByName name riders =
    List.head (List.filter (\rider -> rider.name == name) riders)


getRiderByLowerCaseName : String -> List Rider.Model.Rider -> Maybe Rider.Model.Rider
getRiderByLowerCaseName name riders =
    List.head (List.filter (\rider -> (String.toLower rider.name) == (String.toLower name)) riders)


getRiderByResultId : String -> List Rider.Model.Rider -> Maybe Rider.Model.Rider
getRiderByResultId key riders =
    List.head (List.filter (\rider -> rider.key == key) riders)


calcRaceId : List Race -> Int
calcRaceId races =
    (List.length races) + 1


numMonth : Date.Month -> Int
numMonth month =
    case month of
        Date.Jan ->
            1

        Date.Feb ->
            2

        Date.Mar ->
            3

        Date.Apr ->
            4

        Date.May ->
            5

        Date.Jun ->
            6

        Date.Jul ->
            7

        Date.Aug ->
            8

        Date.Sep ->
            9

        Date.Oct ->
            10

        Date.Nov ->
            11

        Date.Dec ->
            12


leadingZero : Int -> String
leadingZero value =
    if value < 10 then
        "0" ++ toString value
    else
        toString value


formatTime : Date.Date -> String
formatTime datetime =
    leadingZero (Date.hour datetime)
        ++ ":"
        ++ toString (Date.minute datetime)


formatDate : Date.Date -> String
formatDate date =
    toString (Date.year date)
        ++ "-"
        ++ toString (numMonth (Date.month date))
        ++ "-"
        ++ (leadingZero (Date.day date))


getPointsByResults : List Result.Model.Result -> List Race -> Int
getPointsByResults results races =
    List.sum <|
        List.map
            (\result -> getPointsByResult result races)
            results


getPointsByResult : Result.Model.Result -> List Race -> Int
getPointsByResult result races =
    if result.outfit == Outfit.WTOS then
        case getRaceByKey result.raceKey races of
            Just race ->
                getPointsByRaceType race.raceType

            Nothing ->
                0
    else
        0


getPointsByRaceType : RaceType -> Int
getPointsByRaceType category =
    case category of
        RaceType.Classic ->
            4

        RaceType.Criterium ->
            3

        RaceType.Regiocross ->
            2

        RaceType.Other ->
            0

        RaceType.Unknown ->
            0


getRaceByKey : String -> List Race -> Maybe Race
getRaceByKey raceKey races =
    List.head <|
        List.filter
            (\race -> race.key == raceKey)
            races


getPointsByRiderId : String -> List Result.Model.Result -> List Race -> Int
getPointsByRiderId riderKey results races =
    getPointsByResults
        ((List.filter
            (\result -> result.riderKey == riderKey)
            results
         )
        )
        races
