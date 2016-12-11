module App.Helpers exposing (..)

import Race.Model exposing (Race)
import Rider.Model
import Date
import Array

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
    toString (Date.hour datetime)
        -- TODO: use leadingZero
        ++
            ":"
        ++ toString (Date.minute datetime)


formatDate : Date.Date -> String
formatDate date =
    (leadingZero (Date.day date))
        ++ "-"
        ++ toString (numMonth (Date.month date))
        ++ "-"
        ++ toString (Date.year date)
