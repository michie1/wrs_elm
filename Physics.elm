import Focus exposing (..)
import Html exposing (..)



-- OBJECTS


type alias Rider =
  { name : String
  , bike : 
    { speed: Int
    }
  }

-- DO STUFF


main : Html msg
main =
  text (toString (setSpeed rider))


rider : Rider
rider =
  Rider "Michiel" { speed = 3 }


setSpeed : Rider -> Rider
setSpeed rider =
  rider
    |> update (bike => speed) (\speed -> speed + 5)



-- FOCI


speed : Focus { r | speed : a } a
speed =
  create .speed (\f r -> { r | speed = f r.speed })


bike : Focus { r | bike : a } a
bike =
  create .bike (\f r -> { r | bike = f r.bike })

