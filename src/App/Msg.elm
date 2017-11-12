module App.Msg exposing (Msg, Msg(..))

import App.Page exposing (Page)
import App.Routing exposing (Route)
import App.OutsideInfo exposing (InfoForElm)
import Page.Result.Add.Msg as ResultAdd
import Page.Rider.Add.Msg as RiderAdd
import Page.Race.Add.Msg as RaceAdd


type Msg
    = Navigate Page
    | UrlUpdate Route
    | Outside InfoForElm
    | LogErr String
    | Noop
    | RaceAdd RaceAdd.Msg
    | RiderAdd RiderAdd.Msg
    | ResultAdd ResultAdd.Msg
