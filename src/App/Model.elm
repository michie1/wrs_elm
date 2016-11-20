module App.Model exposing (App, initial)--, Mdl, initial)

import Dict exposing (Dict)
--import Material


--import App.Msg exposing (Msg(..))
--import RaceAdd.Msg as RaceAdd
--import RaceAdd.Model exposing (RaceAdd)

import App.Routing as Routing exposing (Route(..))
import Races.Model
import Riders.Model
import Results.Model
import Comments.Model
import Date
import Account.Model


type alias App =
    { route : Routing.Route
    , cache : Dict String (List String)
    , riders : List Riders.Model.Rider
    , races : List Races.Model.Race
    , raceAdd : Maybe Races.Model.Add
    , riderAdd : Riders.Model.RiderAdd
    , results : List Results.Model.Result
    , resultAdd : Maybe Results.Model.ResultAdd
    , comments : List Comments.Model.Comment
    , commentAdd : Maybe Comments.Model.Add
    , now : Maybe Date.Date
    , account : Maybe Riders.Model.Rider
    , accountLogin : Maybe Account.Model.Login
    , accountSignup : Maybe Account.Model.Signup
    --, mdl : Material.Model
    }


--type alias Mdl =
    --Material.Model


initial : App
initial =
    (App
        Home
        Dict.empty
        Riders.Model.initialRiders
        Races.Model.initialRaces
        Nothing
        Riders.Model.empty
        Results.Model.initialResults
        Nothing
        -- Results.Model.empty
        Comments.Model.initialComments
        Nothing
        -- Comments.Model.initialAdd
        Nothing
        Account.Model.initial
        Nothing
        Nothing
        --Material.model
    )
