module Result.Model exposing (Add, Result, initialAdd, initialResults, ResultCategory, ResultCategory(..), categories)

import Rider.Model exposing (Rider)
import Ui.Chooser


type ResultCategory
    = Amateurs
    | Basislidmaatschap
    | CatA
    | CatB
    | Unknown


type alias Result =
    { id : Int
    , riderId : Int
    , raceId : Int
    , result : String
    , category : ResultCategory
    , strava : Maybe String
    }


type alias Add =
    { raceId : Int
    , result : String
    , category : ResultCategory
    , strava : String
    , chooser : Ui.Chooser.Model
    }

initialAdd : Add
initialAdd =
    { raceId = 0
    , result = ""
    , category = Amateurs
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
