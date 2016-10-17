module App.Model exposing (App, Page(..), Rider, Mdl, initial)

import Dict exposing (Dict)
import Material 

import App.Msg exposing (Msg(..))
import RaceAdd.Msg as RaceAdd
import RaceAdd.Model exposing (RaceAdd)

import Race.Model exposing (Race)

type alias App = 
  { page : Page
  , query : String
  , cache : Dict String (List String)
  , counter : Int
  , rider : Rider
  , riders : List Rider
  , races : List Race
  , raceAdd : RaceAdd
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
        ( Rider "Michiel" "Elite") 
        [ Rider "Michiel" "Elite", Rider "Henk" "Amateur" ]
        [ Race "race a", Race "race b" ]
        RaceAdd.Model.initial
        Material.model
    , Cmd.none 
    )



