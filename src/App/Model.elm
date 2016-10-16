module App.Model exposing (App, Page(..), Rider, Mdl, initial)

import Array exposing (Array, fromList, get)
import Dict exposing (Dict)
import Material 

import App.Msg exposing (Msg(..))
import RaceAdd.Msg as RaceAdd

import Race.Model exposing (Race)

type alias App = 
  { page : Page
  , query : String
  , cache : Dict String (List String)
  , counter : Int
  , rider : Rider
  , riders : Array Rider
  , races : Array Race
  , mdl : Material.Model
  }

type Page = 
    Home 
  | Riders
  | Races
  | RaceAddPage


type alias Rider = 
  { name : String
  , licence : String
  }

type alias Mdl = 
  Material.Model 


initial : ( App, Cmd Msg)
initial =
    ( App 
        Home
        ""
        Dict.empty
        1
        (Rider "Michiel" "Elite") 
        (fromList [ Rider "Michiel" "Elite", Rider "Henk" "Amateur" ])
        (fromList [ Race "race a", Race "race b" ])
        Material.model
    , Cmd.none 
    )



