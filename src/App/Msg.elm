module App.Msg exposing (Msg(..))

import Material

import RaceAdd.Msg as RaceAdd

import Race.Model exposing (Race)

import App.Page exposing (Page(..))

type Msg
  --= RaceAdd RaceAdd.Msg
  --| RacesMsg Races.Msg.Msg
  = Add Race
  | SetName String
  | GoTo Page
  | Mdl (Material.Msg Msg)

