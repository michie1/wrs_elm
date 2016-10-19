module App.Model exposing (App, Rider, Mdl, initial)

import Dict exposing (Dict)
import Material
import App.Msg exposing (Msg(..))
import RaceAdd.Msg as RaceAdd
import RaceAdd.Model exposing (RaceAdd)
import Race.Model exposing (Race)
import App.Page as Page exposing (Page(..))


type alias App =
    { page : Page.Page
    , query : String
    , cache : Dict String (List String)
    , counter : Int
    , rider : Rider
    , riders : List Rider
    , races : List Race
    , raceAdd : RaceAdd
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
        [ Race "race a", Race "race c" ]
        RaceAdd.Model.initial
        Material.model
    , Cmd.none
    )
