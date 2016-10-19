module RaceAdd.Msg exposing (Msg(..))

import Material
import Race.Model exposing (Race)


type Msg
    = SetName String
    | Mdl (Material.Msg Msg)
