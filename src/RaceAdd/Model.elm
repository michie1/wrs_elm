module RaceAdd.Model exposing (RaceAdd, initial)

import Material 

type alias RaceAdd =
  { name : String
  , mdl : Material.Model
  }

initial : RaceAdd
initial =
  { name = "HOI"
  , mdl = Material.model
  }
