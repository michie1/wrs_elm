module App.Page exposing (Page, Page(..))
import Rider.Model
import Race.Model
import Result.Model

type Page
    = Riders
    | RiderDetails String
    | RiderAdd Rider.Model.Add
    --
    | Races
    | RaceDetails String
    | RaceAdd Race.Model.Add
    --
    | ResultAdd Result.Model.Add
