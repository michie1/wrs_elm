module App.Model exposing (App, Mdl, initial)

import Dict exposing (Dict)
import Material
import App.Msg exposing (Msg(..))
--import RaceAdd.Msg as RaceAdd
--import RaceAdd.Model exposing (RaceAdd)
import App.Page as Page exposing (Page(..))
import Races.Model
import Riders.Model 


type alias App =
    { page : Page.Page
    , cache : Dict String (List String)
    , riders : List Riders.Model.Rider
    , races : List Races.Model.Race
    , raceAdd : Races.Model.RaceAdd
    , riderAdd : Riders.Model.RiderAdd
    , mdl : Material.Model
    }





type alias Mdl =
    Material.Model


initial : ( App, Cmd Msg )
initial =
    ( App
        Home
        Dict.empty
        [ Riders.Model.Rider 1 "Michiel" "Elite", Riders.Model.Rider 2 "Henk" "Amateur" ]
        [ (Races.Model.Race 1 "race a"), (Races.Model.Race 2 "race c") ]
        Races.Model.initial
        Riders.Model.initial
        Material.model
    , Cmd.none
    )
