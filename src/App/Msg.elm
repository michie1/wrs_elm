module App.Msg exposing (Msg, Msg(..))

import Json.Encode
import Ui.Calendar
import Ui.Chooser
import Json.Decode
import App.Page exposing (Page)
import App.Routing exposing (Route)
import App.OutsideInfo exposing (InfoForElm)
import Data.Outfit exposing (Outfit)
import Data.RaceType exposing (RaceType)
import Data.Licence exposing (Licence)
import Data.ResultCategory exposing (ResultCategory)
import Page.Result.Add.Msg as ResultAdd
import Page.Rider.Add.Msg as RiderAdd
import Page.Race.Add.Msg as RaceAdd


type Msg
    = NavigateTo Page
    | UrlUpdate Route
    | Outside InfoForElm
    | LogErr String
    | Noop
    | RaceAdd RaceAdd.Msg
    | RiderAdd RiderAdd.Msg
    | ResultAdd ResultAdd.Msg
    | ResultAddedJson Json.Decode.Value
