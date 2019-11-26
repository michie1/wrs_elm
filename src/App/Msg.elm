module App.Msg exposing (Msg(..))

import App.OutsideInfo exposing (InfoForElm)
import App.Page exposing (Page)
import App.Routing exposing (Route)
import Page.Race.Add.Msg as RaceAdd
import Page.Result.Add.Msg as ResultAdd
import Page.Result.Edit.Msg as ResultEdit
import Page.Rider.Add.Msg as RiderAdd


type Msg
    = Navigate Page
    | UrlUpdate Route
    | Outside InfoForElm
    | LogErr String
    | Noop
    | RaceAdd RaceAdd.Msg
    | RiderAdd RiderAdd.Msg
    | ResultAdd ResultAdd.Msg
    | ResultEdit ResultEdit.Msg
    | UserSignOut
