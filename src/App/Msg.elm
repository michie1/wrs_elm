module App.Msg exposing (Msg(..))

import Material

import RaceAdd.Msg as RaceAdd

type Msg
  = Increment
  | GoToRiders
  | Add
  | GoToRaceAdd
  --| RaceAdd RaceAdd.Msg
  | RaceAdd RaceAdd.Msg
  | Mdl (Material.Msg Msg)
