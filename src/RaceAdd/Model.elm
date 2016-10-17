module RaceAdd.Model exposing (RaceAdd, initial)

import Material 

import Race.Model exposing (Race)

type alias RaceAdd =
  { race: Race
  }

initial : RaceAdd
initial =
  { race = Race "Initial"
  }
