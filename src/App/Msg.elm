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
import Ui.Ratings
import Ui.Calendar
import Ui.Chooser
import Http

type Msg
    = RaceAdd
    | RaceName String
    | RaceDate String
    | RaceAddCategory Race.Model.Category
    | ResultAdd
    | ResultAddCategory Result.Model.ResultCategory
    | ResultAddStrava String
    | ResultAddResult String
    | CommentAddSetText String
    | CommentAddSetRiderName String
    | CommentAdd
    | AccountLogin String
    | AccountLoginEmail String
    | AccountLoginPassword String
    | AccountLoginSubmit
    | AccountLogout String
    | AccountLogoutSubmit
    | AccountSignup
    | AccountLicence Rider.Model.Licence
    | NavigateTo App.Routing.Route
    | UrlUpdate App.Routing.Route
    | Noop
    | NewMessage String
    | ReceiveMessage Json.Encode.Value
    | ReceiveRiders Json.Encode.Value
    | HandleSendError Json.Encode.Value
    | OnCreatedRider Json.Encode.Value
    | OnCreatedRace Json.Encode.Value
    | OnCreatedResult Json.Encode.Value
    | OnCreatedComment Json.Encode.Value
    | OnUpdatedRider Json.Encode.Value
    | DatePicked String
    | Ratings Ui.Ratings.Msg
    | Calendar Ui.Calendar.Msg
    | Chooser Ui.Chooser.Msg
    | StravaAuthorize
    | StravaReceiveAccessToken Json.Encode.Value
