module App.Helpers exposing (formatDate, navigate)

import App.Msg
import App.Page
import App.Routing
import Browser.Navigation
import DateFormat
import Time exposing (Posix, utc)


navigate : Browser.Navigation.Key -> App.Page.Page -> Cmd App.Msg.Msg
navigate key page =
    Browser.Navigation.pushUrl key <| App.Routing.pathFor page


formatDate : Posix -> String
formatDate timestamp =
    DateFormat.format
        [ DateFormat.yearNumber
        , DateFormat.text "-"
        , DateFormat.monthFixed
        , DateFormat.text "-"
        , DateFormat.dayOfMonthFixed
        ]
        utc
        timestamp
