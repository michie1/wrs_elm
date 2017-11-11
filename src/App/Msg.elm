module App.Msg exposing (Msg, Msg(..))

import Json.Encode
import Ui.Calendar
import Ui.Chooser
import Json.Decode
import App.Page exposing (Page)
import App.Routing exposing (Route)
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
    | Noop
      --
    | RaceAdd RaceAdd.Msg
    | RaceAddedJson Json.Decode.Value
    | RacesJson Json.Decode.Value
      --
    | ResultAdd ResultAdd.Msg
    | ResultAddedJson Json.Decode.Value
    | ResultsJson Json.Decode.Value
      --
    | RiderAdd RiderAdd.Msg
    | RiderAddedJson Json.Decode.Value
    | RidersJson Json.Decode.Value
