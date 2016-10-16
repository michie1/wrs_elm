module App.Msg exposing (Msg(..))

import Material

import RaceAdd.Msg as RaceAdd

import Races.Msg

type Msg
  = RaceAdd RaceAdd.Msg
  | RacesMsg Races.Msg.Msg
  | Mdl (Material.Msg Msg)

