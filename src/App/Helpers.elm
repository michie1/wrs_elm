module App.Helpers exposing (formatDate, formatTime, leadingZero, navigate, numMonth)

import App.Msg
import App.Page
import App.Routing
import Date
import Navigation


navigate : App.Page.Page -> Cmd App.Msg.Msg
navigate page =
    Navigation.newUrl <| App.Routing.url page


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
        ++ leadingZero (Date.day date)
