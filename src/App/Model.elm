module App.Model exposing (App, initial)


import Dict exposing (Dict)


import App.Routing as Routing exposing (Route(..))
import Races.Model
import Riders.Model
import Results.Model
import Comments.Model
import Date
import Account.Model
import Keyboard.Extra


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
    , keyboardModel : Keyboard.Extra.Model
    }


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
        Comments.Model.initialComments
        Nothing
        Nothing
        Account.Model.initial
        Nothing
        Nothing
        (Tuple.first Keyboard.Extra.init)
    )
