module App.Page exposing (Page(..))

import Page.Rider.List.Model as RiderList
import Page.Race.Add.Model as RaceAdd
import Page.Result.Add.Model as ResultAdd
import Page.Result.Edit.Model as ResultEdit
import Page.Rider.Add.Model as RiderAdd
import Page.Rider.Edit.Model as RiderEdit


type Page
    = Races
    | RaceDetails String
    | RaceAdd RaceAdd.Model
      --
    | Riders RiderList.Model
    | RiderDetails String
    | RiderAdd RiderAdd.Model
    | RiderEdit RiderEdit.Model
      --
    | ResultAdd ResultAdd.Model
    | ResultEdit ResultEdit.Model
