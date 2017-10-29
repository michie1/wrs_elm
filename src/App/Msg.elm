module App.Msg exposing (Msg(..))

--import Material
--import Races.Model exposing (Race)

import Rider.Model exposing (Rider)
import Race.Model
import Result.Model
import App.Routing
import Date
import Time
import Keyboard
import Keyboard.Extra
import Json.Encode
import Ui.Calendar
import Ui.Chooser
import Http
import Json.Decode
import App.Page

type Msg
    = RaceAdd
    | RaceAddSubmit
    | RaceName String
    | RaceDate String
    | RaceAddCategory Race.Model.Category
    | RacesJson Json.Decode.Value
    | RaceAddedJson Json.Decode.Value
    | ResultAddSubmit
    | ResultAddCategory Result.Model.ResultCategory
    | ResultAddOutfit Result.Model.Outfit
    | ResultAddResult String
    | ResultAddedJson Json.Decode.Value
    | ResultsJson Json.Decode.Value
    | RiderAddSubmit
    | RiderAddLicence Rider.Model.Licence
    | RiderAddName String
    | RiderAddedJson Json.Decode.Value
    | NavigateTo App.Page.Page
    | UrlUpdate App.Routing.Route
    | Noop
    | NewMessage String
    | ReceiveMessage Json.Encode.Value
    | ReceiveRiders Json.Encode.Value
    | RidersJson Json.Decode.Value
    | HandleSendError Json.Encode.Value
    --| OnCreatedRider Json.Encode.Value
    --| OnCreatedRace Json.Encode.Value
    | OnCreatedResult Json.Encode.Value
    | OnUpdatedRider Json.Encode.Value
    | DatePicked String
    | Calendar Ui.Calendar.Msg
    | Chooser Ui.Chooser.Msg
