module RaceAdd.Msg exposing (Msg(..))

import Material

import Race.Model exposing (Race)


type Msg
  = Add Race
  | Mdl (Material.Msg Msg)
