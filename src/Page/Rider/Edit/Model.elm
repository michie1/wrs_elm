module Page.Rider.Edit.Model exposing (Model, initial)

import Data.Licence exposing (Licence)
import Data.Rider exposing (Rider)


type alias Model =
    { riderName : String
    , riderKey : String
    , currentLicence : Licence
    , licence : Licence
    }


initial : String -> Maybe (List Rider) -> Maybe Model
initial riderKey maybeRiders =
    maybeRiders
        |> Maybe.andThen
            (\riders ->
                riders
                    |> List.filter (\rider -> rider.key == riderKey)
                    |> List.head
                    |> Maybe.map
                        (\rider ->
                            { riderName = rider.name
                            , riderKey = riderKey
                            , currentLicence = rider.licence
                            , licence = rider.licence
                            }
                        )
            )
