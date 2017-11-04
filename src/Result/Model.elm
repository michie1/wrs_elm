module Result.Model exposing (Result, Add, initialAdd, ResultCategory, ResultCategory(..), categories )

import Rider.Model exposing (Rider)
import Ui.Chooser
import App.Outfit as Outfit exposing (Outfit)


type ResultCategory
    = Amateurs
    | Basislidmaatschap
    | CatA
    | CatB
    | Unknown

type alias Result =
    { key : String
    , riderKey : String
    , raceKey : String
    , result : String
    , category : ResultCategory
    , outfit : Outfit
    }


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
    , category = Amateurs
    , outfit = Outfit.WTOS
    , strava = ""
    , chooser = ( Ui.Chooser.init ()
                    |> Ui.Chooser.closeOnSelect True
                    |> Ui.Chooser.searchable True
                    )
    }

categories : List ResultCategory
categories =
    [ Amateurs
    , Basislidmaatschap
    , CatA
    , CatB
    , Unknown
    ]
