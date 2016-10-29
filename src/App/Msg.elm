module App.Msg exposing (Msg(..))

import Material
import Races.Model exposing (Race)
import Riders.Model exposing (Rider)
import App.Page exposing (Page(..))


type Msg
    = AddRace Race
    | SetRaceName String
    | AddRider Rider
    | SetRiderName String
    | AddResult
    | SetResultResult String
    | SetResultRider String
    | SetResultRiderName String
    | ResultAddSetRiderId Int
    | CommentAddSetText String
    | CommentAddSetRiderIndex Int
    | CommentAdd
    | Alert String
    | Log String
    | SetState String
    | Reset
    | GoTo Page
    | Mdl (Material.Msg Msg)
