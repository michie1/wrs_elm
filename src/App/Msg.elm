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


type Msg
    = RaceAdd
    | SetRaceName String
    | SetRaceDate String
    | RaceAddCategory Races.Model.Category
    | AddRider Rider
    | SetRiderName String
    | ResultAdd
    | ResultAddCategory Results.Model.ResultCategory
    | SetResultAddResult String
      --| SetResultRider String
    | SetResultRiderName String
      --| ResultAddSetRiderId Int
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
      --(Maybe Date.Date)
    | SetRaceAddToday2 (Maybe Date.Date)
    | UpdateMaterialize
    | ResultAddAutocomplete Int
      -- Send
    | SetAutocomplete ( String, String )
      -- Receive
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



--| Mdl (Material.Msg Msg)
