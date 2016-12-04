module App.Msg exposing (Msg(..))

--import Material
--import Races.Model exposing (Race)

import Riders.Model exposing (Rider)
import Races.Model
import Results.Model
import App.Routing exposing (Route(..))
import Date
import Time
import Keyboard
import Keyboard.Extra

import Phoenix.Socket
import Json.Encode


type Msg
    = RaceAdd
    | SetRaceName String
    | SetRaceDate String
    | RaceAddCategory Races.Model.Category
    | AddRider Rider
    | SetRiderName String
    | ResultAdd
    | ResultAddCategory Results.Model.ResultCategory
    | ResultAddStrava String
    | SetResultAddResult String
    | SetResultRiderName String
    | CommentAddSetText String
    | CommentAddSetRiderName String
    | CommentAdd
    | CommentAdd2 (Maybe Time.Time)
    | Save
    | Log String
    | SetState String
    | Reset
    | SetNow (Maybe Date.Date)
    | SetRaceAdd (Maybe Date.Date)
    | SetRaceAddYesterday
    | SetRaceAddYesterday2 (Maybe Date.Date)
    | SetRaceAddToday
    | SetRaceAddToday2 (Maybe Date.Date)
    | UpdateMaterialize
    | ResultAddAutocomplete Int
    | SetAutocomplete ( String, String )
    | NavigateTo Route
    | UrlUpdate Route
    | AccountLogin
    | AccountLoginName String
    | AccountLoginPassword String
    | AccountLoginAutocomplete
    | AccountLogout
    | AccountSignup
    | AccountSignupName String
    | AccountLicence Riders.Model.Licence
    | KeyDown Keyboard.KeyCode
    | KeyboardMsg Keyboard.Extra.Msg
    | Noop
    | Input String
    | Send
    | NewMessage String
    | PhoenixMsg (Phoenix.Socket.Msg Msg)
    | ReceiveMessage Json.Encode.Value
    | ReceiveRiders Json.Encode.Value
    | HandleSendError Json.Encode.Value
