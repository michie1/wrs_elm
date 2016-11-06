module App.Model exposing (App, Mdl, initial)

import Dict exposing (Dict)
import Material
--import App.Msg exposing (Msg(..))


--import RaceAdd.Msg as RaceAdd
--import RaceAdd.Model exposing (RaceAdd)

import App.Page as Page exposing (Page(..))
import Races.Model
import Riders.Model
import Results.Model
import Comments.Model


type alias App =
    { page : Page.Page
    , cache : Dict String (List String)
    , riders : List Riders.Model.Rider
    , races : List Races.Model.Race
    , raceAdd : Maybe Races.Model.Add
    , riderAdd : Riders.Model.RiderAdd
    , results : List Results.Model.Result
    , resultAdd : Maybe Results.Model.ResultAdd
    , comments : List Comments.Model.Comment
    , commentAdd : Maybe Comments.Model.Add
    , mdl : Material.Model
    }


type alias Mdl =
    Material.Model


initial : ( App )
    --, Cmd Msg )
initial =
    ( App
        Home
        Dict.empty
        Riders.Model.initialRiders
        Races.Model.initialRaces
        Nothing
        Riders.Model.empty
        Results.Model.initialResults
        Nothing -- Results.Model.empty
        Comments.Model.initialComments
        Nothing -- Comments.Model.initialAdd
        Material.model
    --, Cmd.none
    )
