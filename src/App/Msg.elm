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
import Phoenix.Socket
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
    | RaceAddSocketResponse Json.Encode.Value
    | RacesSocket
    | RacesSocketResponse Json.Encode.Value
    | ResultAdd
    | ResultAddSocketResponse Json.Encode.Value
    | ResultAddCategory Result.Model.ResultCategory
    | ResultAddStrava String
    | ResultAddResult String
    | ResultsSocket
    | ResultsSocketResponse Json.Encode.Value
    | CommentsSocket
    | CommentsSocketResponse Json.Encode.Value
    | RidersSocket
    | RidersSocketResponse Json.Encode.Value
    | CommentAddSetText String
    | CommentAddSetRiderName String
    | CommentAdd
    | CommentAddSocketResponse Json.Encode.Value
    | AccountLogin
    | AccountLoginName String
    | AccountLoginPassword String
    | AccountLogout
    | AccountSignup
    | AccountSignupName String
    | AccountLicence Rider.Model.Licence
    | SocketAccountLicence
    | SocketAccountLicenceResponse Json.Encode.Value
    | SocketAccountSignup
    | SocketAccountSignupResponse Json.Encode.Value
    | NavigateTo App.Routing.Route
    | UrlUpdate App.Routing.Route
    | Noop
    | Connect
    | NewMessage String
    | PhoenixMsg (Phoenix.Socket.Msg Msg)
    | ConnectResponse Json.Encode.Value
    | ReceiveMessage Json.Encode.Value
    | ReceiveRiders Json.Encode.Value
    | HandleSendError Json.Encode.Value
    | OnCreatedRider Json.Encode.Value
    | OnCreatedRace Json.Encode.Value
    | OnCreatedResult Json.Encode.Value
    | OnCreatedComment Json.Encode.Value
    | OnUpdatedRider Json.Encode.Value
    | OnJoinResponse Json.Encode.Value
    | OnJoin
    | DatePicked String
    | Ratings Ui.Ratings.Msg
    | Calendar Ui.Calendar.Msg
    | Chooser Ui.Chooser.Msg
    | StravaAuthorize
    | StravaReceiveAccessToken Json.Encode.Value
