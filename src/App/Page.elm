module App.Page exposing (Page, Page(..))
import Page.Rider.Add.Model as RiderAdd
import Page.Race.Add.Model as RaceAdd
import Page.Result.Add.Model as ResultAdd

type Page
    = Riders
    | RiderDetails String
    | RiderAdd RiderAdd.Model
    --
    | Races
    | RaceDetails String
    | RaceAdd RaceAdd.Model
    --
    | ResultAdd ResultAdd.Model
