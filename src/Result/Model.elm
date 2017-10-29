module Result.Model exposing (Add, Result, initialAdd, initialResults, ResultCategory, ResultCategory(..), categories, Outfit, Outfit(..))

import Rider.Model exposing (Rider)
import Ui.Chooser


type ResultCategory
    = Amateurs
    | Basislidmaatschap
    | CatA
    | CatB
    | Unknown

type Outfit
    = WTOS
    | WASP
    | Other

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
    , outfit = WTOS
    , strava = ""
    , chooser = ( Ui.Chooser.init ()
                    |> Ui.Chooser.closeOnSelect True
                    |> Ui.Chooser.searchable True
                    )
    }


initialResults : List Result
initialResults =
    []



--[ Result 1 1 1 "9000" CatA Nothing ]


categories : List ResultCategory
categories =
    [ Amateurs
    , Basislidmaatschap
    , CatA
    , CatB
    , Unknown
    ]
