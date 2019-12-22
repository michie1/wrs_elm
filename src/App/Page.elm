module App.Page exposing (Page(..))

import Page.Race.Add.Model as RaceAdd
import Page.Result.Add.Model as ResultAdd
import Page.Result.Edit.Model as ResultEdit
import Page.Rider.Add.Model as RiderAdd
import Time


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
