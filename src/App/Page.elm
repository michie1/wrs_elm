module App.Page exposing (Page, Page(..))
import Page.Rider.Model 
import Page.Race.Add.Model as RaceAdd
import Page.Result.Add.Model as ResultAdd

type Page
    = Riders
    | RiderDetails String
    | RiderAdd Page.Rider.Model.Add
    --
    | Races
    | RaceDetails String
    | RaceAdd RaceAdd.Model
    --
    | ResultAdd ResultAdd.Model
