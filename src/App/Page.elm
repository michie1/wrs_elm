module App.Page exposing (Page, Page(..))
import Page.Rider.Model
import Page.Race.Model
import Page.Result.Model

type Page
    = Riders
    | RiderDetails String
    | RiderAdd Page.Rider.Model.Add
    --
    | Races
    | RaceDetails String
    | RaceAdd Page.Race.Model.Add
    --
    | ResultAdd Page.Result.Model.Add
