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


type Msg
    = RaceAdd
    | RaceName String
    | RaceDate String
    | RaceAddCategory Race.Model.Category
    | SetRaceAdd (Maybe Date.Date)
    | RaceAddYesterday
    | RaceAddYesterdayWithDate (Maybe Date.Date)
    | RaceAddToday
    | RaceAddTodayWithDate (Maybe Date.Date)
    | RaceAddSocketResponse Json.Encode.Value
    | RacesSocket
    | RacesSocketResponse Json.Encode.Value
    | ResultAdd
    | ResultAddCategory Result.Model.ResultCategory
    | ResultAddStrava String
    | ResultAddResult String
    | ResultRiderName String
    | CommentAddSetText String
    | CommentAddSetRiderName String
    | CommentAdd
    | CommentAddWithTime (Maybe Time.Time)
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
    | ReceiveMessage Json.Encode.Value
    | ReceiveRiders Json.Encode.Value
    | HandleSendError Json.Encode.Value
    | OnCreatedRider Json.Encode.Value
    | OnCreatedRace Json.Encode.Value
    | OnUpdatedRider Json.Encode.Value
