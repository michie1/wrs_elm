module Page.Result.Model exposing (Add, initialAdd)

import Data.Rider exposing (Rider)
import Ui.Chooser
import Data.Outfit as Outfit exposing (Outfit)
import Data.ResultCategory as ResultCategory exposing (ResultCategory)


type alias Add =
    { raceKey : String
    , riderKey : Maybe String
    , result : String
    , category : ResultCategory
    , outfit : Outfit
    , strava : String
    , chooser : Ui.Chooser.Model
    }


initialAdd : Add
initialAdd =
    { raceKey = ""
    , riderKey = Nothing
    , result = ""
    , category = ResultCategory.Amateurs
    , outfit = Outfit.WTOS
    , strava = ""
    , chooser =
        (Ui.Chooser.init ()
            |> Ui.Chooser.closeOnSelect True
            |> Ui.Chooser.searchable True
        )
    }
