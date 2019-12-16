module App.Helpers exposing (formatDate, formatTime, leadingZero, navigate, numMonth)

import App.Msg
import App.Page
import App.Routing
import Browser.Navigation
import Date
import Time exposing (Posix)


navigate : App.Page.Page -> Cmd App.Msg.Msg
navigate page =
    Browser.Navigation.load <| App.Routing.url page


numMonth : Date.Month -> Int
numMonth month =
    case month of
        Time.Jan ->
            1

        Time.Feb ->
            2

        Time.Mar ->
            3

        Time.Apr ->
            4

        Time.May ->
            5

        Time.Jun ->
            6

        Time.Jul ->
            7

        Time.Aug ->
            8

        Time.Sep ->
            9

        Time.Oct ->
            10

        Time.Nov ->
            11

        Time.Dec ->
            12


leadingZero : Int -> String
leadingZero value =
    if value < 10 then
        "0" ++ String.fromInt value

    else
        String.fromInt value


formatTime : Date.Date -> String
formatTime datetime =
    -- TODO: format date
    "format time"


formatDate : Posix -> String
formatDate date =
    -- TODO: format date
    "format date"
