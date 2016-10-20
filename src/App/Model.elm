module App.Model exposing (App, Rider, Mdl, initial)

import Dict exposing (Dict)
import Material
import App.Msg exposing (Msg(..))
--import RaceAdd.Msg as RaceAdd
--import RaceAdd.Model exposing (RaceAdd)
import App.Page as Page exposing (Page(..))
import Races.Model


type alias App =
    { page : Page.Page
    , query : String
    , cache : Dict String (List String)
    , counter : Int
    , rider : Rider
    , riders : List Rider
    , races : List Races.Model.Race
    , raceAdd : Races.Model.RaceAdd
    , mdl : Material.Model
    }


type alias Rider =
    { name : String
    , licence : String
    }


type alias Mdl =
    Material.Model


initial : ( App, Cmd Msg )
initial =
    ( App
        Home
        ""
        Dict.empty
        1
        (Rider "Michiel" "Elite")
        [ Rider "Michiel" "Elite", Rider "Henk" "Amateur" ]
        [ (Races.Model.Race 1 "race a"), (Races.Model.Race 2 "race c") ]
        Races.Model.initial
        Material.model
    , Cmd.none
    )
