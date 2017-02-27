module App.Helpers exposing (..)

import Race.Model exposing (Race)
import Rider.Model
import Date
import Array
import Navigation
import App.Msg
import App.Routing
import Result.Model

navigate : App.Routing.Route -> Cmd App.Msg.Msg
navigate route =
    Navigation.newUrl <| App.Routing.url route


updateRiderLicence : Int -> Maybe Rider.Model.Licence -> List Rider.Model.Rider -> List Rider.Model.Rider
updateRiderLicence riderId maybeLicence riders =
    List.map
        (\rider ->
            case rider.id == riderId of
                True ->
                    { rider | licence = maybeLicence }

                False ->
                    rider
        )
        riders


getRiderByName : String -> List Rider.Model.Rider -> Maybe Rider.Model.Rider
getRiderByName name riders =
    List.head (List.filter (\rider -> rider.name == name) riders)


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


getPointsByResults : List Result.Model.Result -> List Race.Model.Race -> Int
getPointsByResults results races =
    List.sum <|
        List.map
        (\result -> getPointsByResult result races )
        results

getPointsByResult : Result.Model.Result -> List Race.Model.Race -> Int
getPointsByResult result races =
    case getRaceById result.raceId races of
        Just race ->
            getPointsByCategory race.category
    
        Nothing ->
            0
    
getPointsByCategory :  Race.Model.Category -> Int
getPointsByCategory category =
    case category of
        Race.Model.Classic ->
            4
        Race.Model.Criterium ->
            3

        Race.Model.Regiocross ->
            2

        Race.Model.Other ->
            0

        Race.Model.Unknown ->
            0


getRaceById : Int -> List Race.Model.Race -> Maybe Race.Model.Race
getRaceById raceId races =
    List.head <|
        List.filter
            (\race -> race.id == raceId)
            races
