module Result.Update exposing (addCategory, addStrava, addResult)

import App.Model exposing (App)
import Result.Model exposing (Add)
import Rider.Model
import App.Msg exposing (Msg(..))
import Result.Helpers exposing (..)
import App.Helpers
import App.Routing
import Json.Encode
import Json.Decode
import App.Encoder
import App.Decoder
import Set
import App.UrlUpdate


addCategory :
    Result.Model.ResultCategory
    -> Result.Model.Add
    -> Result.Model.Add
addCategory category resultAdd =
    { resultAdd | category = category }


addStrava : String -> Result.Model.Add -> Result.Model.Add
addStrava link resultAdd =
    { resultAdd | strava = link }


addResult : String -> Result.Model.Add -> Result.Model.Add
addResult value resultAdd =
    { resultAdd | result = value }

