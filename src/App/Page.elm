module App.Page exposing (Page, Page(..))
import Rider.Model
import Result.Model
import Race.Model

type Page
    = RaceAdd Race.Model.Add
    | ResultAdd Result.Model.Add
    | RiderAdd Rider.Model.Add
    | RiderDetails String
    | Riders
    | RaceDetails String
    | Races
