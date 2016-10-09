module Types exposing (..)

import Array exposing (Array, fromList, get)
import Dict exposing (Dict)
import Material

type alias Model = 
  { page : Page
  , query : String
  , cache : Dict String (List String)
  , counter : Int
  , rider : Rider
  , races : Array Race
  , mdl : Material.Model
  }

type Page = 
    Home 
  | Riders
  | Races


type alias Rider = 
  { name : String
  , licence : String
  }

type alias Race =
  { name: String
  }


