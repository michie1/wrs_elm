module Data.RaceResult exposing (RaceResult)

import Data.ResultCategory exposing (ResultCategory)
import Data.Outfit exposing (Outfit)

type alias RaceResult =
    { key : String
    , riderKey : String
    , raceKey : String
    , result : String
    , category : ResultCategory
    , outfit : Outfit
    }
