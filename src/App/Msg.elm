module App.Msg exposing (Msg(..))

--import Material
--import Races.Model exposing (Race)

import Rider.Model exposing (Rider)
import Race.Model
import Result.Model
import App.Routing
import Json.Encode
import Ui.Calendar
import Ui.Chooser
import Http
import Json.Decode
import App.Page
import App.Outfit exposing (Outfit)

type Msg
    = RaceAdd
    | RaceAddSubmit
    | RaceName String
    | RaceDate String
    | RaceAddCategory Race.Model.Category
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
