module App.Msg exposing (Msg(..))

import Material

import Races.Model exposing (Race)
import Riders.Model exposing (Rider)
import App.Page exposing (Page(..))

import Results.Model


type
    Msg
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

    | GoTo Page
    | Mdl (Material.Msg Msg)
