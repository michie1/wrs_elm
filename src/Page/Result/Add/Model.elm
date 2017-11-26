module Page.Result.Add.Model exposing (Model, initial)

import Data.Outfit as Outfit exposing (Outfit)
import Data.ResultCategory as ResultCategory exposing (ResultCategory)


type alias Model =
    { raceKey : String
    , riderKey : Maybe String
    , result : String
    , category : ResultCategory
    , outfit : Outfit
    , strava : String
    }


initial : Model
initial =
    { raceKey = ""
    , riderKey = Nothing
    , result = ""
    , category = ResultCategory.Amateurs
    , outfit = Outfit.WTOS
    , strava = ""
    }
