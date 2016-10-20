module App.Msg exposing (Msg(..))

import Material

import Races.Model exposing (Race)
import Riders.Model exposing (Rider)
import App.Page exposing (Page(..))


type
    Msg
    = AddRace Race
    | AddRider Rider
    | SetRaceName String
    | SetRiderName String
    | GoTo Page
    | Mdl (Material.Msg Msg)
