module App.Msg exposing (Msg(..))

import Rider.Model
import Race.Model
import Result.Model
import App.Routing
import Json.Encode
import Ui.Calendar
import Ui.Chooser
import Json.Decode
import App.Page
import Data.Outfit exposing (Outfit)
import Data.RaceType exposing (RaceType)


type Msg
    = RaceAddSubmit
    | RaceName String
    | RaceDate String
    | RaceAddRaceType RaceType
    | RacesJson Json.Decode.Value
    | RaceAddedJson Json.Decode.Value
    | Calendar Ui.Calendar.Msg
      --
    | ResultAddSubmit
    | ResultAddCategory Result.Model.ResultCategory
    | ResultAddOutfit Outfit
    | ResultAddResult String
    | ResultAddedJson Json.Decode.Value
    | ResultsJson Json.Decode.Value
    | Chooser Ui.Chooser.Msg
      --
    | RiderAddSubmit
    | RiderAddLicence Rider.Model.Licence
    | RiderAddName String
    | RiderAddedJson Json.Decode.Value
    | RidersJson Json.Decode.Value
      --
    | NavigateTo App.Page.Page
    | UrlUpdate App.Routing.Route
    | Noop
