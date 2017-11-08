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


type Msg
    = RaceAddSubmit
    | RaceName String
    | RaceDate String
    | RaceAddRaceType RaceType
    | RacesJson Json.Decode.Value
    | RaceAddedJson Json.Decode.Value
    | Calendar Ui.Calendar.Msg
      --
    | ResultAddMsg ResultAdd.Msg
    | ResultAddedJson Json.Decode.Value
    | ResultsJson Json.Decode.Value
      --
    | RiderAddMsg RiderAdd.Msg
    | RiderAddedJson Json.Decode.Value
    | RidersJson Json.Decode.Value
      --
    | NavigateTo Page
    | UrlUpdate Route
    | Noop
