module App.Msg exposing (Msg(..))

import Material

import Races.Model exposing (Race)
import App.Page exposing (Page(..))


type
    Msg
    = Add Race
    | SetName String
    | GoTo Page
    | Mdl (Material.Msg Msg)
