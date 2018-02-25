module App.Page exposing (Page, Page(..))

import Page.Rider.Add.Model as RiderAdd
import Page.Race.Add.Model as RaceAdd
import Page.Result.Add.Model as ResultAdd
import Page.Result.Edit.Model as ResultEdit


type Page
    = Races
    | RaceDetails String
    | RaceAdd RaceAdd.Model
      --
    | Riders
    | RiderDetails String
    | RiderAdd RiderAdd.Model
      --
    | ResultAdd ResultAdd.Model
    | ResultEdit ResultEdit.Model
