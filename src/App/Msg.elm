module App.Msg exposing (Msg(..))

import App.Routing
import Json.Encode
import Ui.Calendar
import Ui.Chooser
import Json.Decode
import App.Page
import Data.Outfit exposing (Outfit)
import Data.RaceType exposing (RaceType)
import Data.Licence exposing (Licence)
import Data.ResultCategory exposing (ResultCategory)


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
    | ResultAddCategory ResultCategory
    | ResultAddOutfit Outfit
    | ResultAddResult String
    | ResultAddedJson Json.Decode.Value
    | ResultsJson Json.Decode.Value
    | Chooser Ui.Chooser.Msg
      --
    | RiderAddSubmit
    | RiderAddLicence Licence
    | RiderAddName String
    | RiderAddedJson Json.Decode.Value
    | RidersJson Json.Decode.Value
      --
    | NavigateTo App.Page.Page
    | UrlUpdate App.Routing.Route
    | Noop
