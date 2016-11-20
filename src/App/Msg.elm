module App.Msg exposing (Msg(..))

--import Material


--import Races.Model exposing (Race)

import Riders.Model exposing (Rider)
import App.Routing exposing (Route(..))
import Date


type Msg
    = AddRace
    | SetRaceName String
    | SetRaceDate String
    | AddRider Rider
    | SetRiderName String
    | AddResult
    | SetResultAddResult String
    | SetResultRider String
    | SetResultRiderName String
    | ResultAddSetRiderId Int
    | CommentAddSetText String
    | CommentAddSetRiderName String
    | CommentAdd
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
    | Autocomplete Int
    | NavigateTo Route
    | UrlUpdate Route
    | AccountLogin
    | AccountLoginName String
    | AccountLoginPassword String
    | AccountLogout
    --| Mdl (Material.Msg Msg)
