module Page.Result.Edit.Model exposing (Model, initial)

import Data.RaceResult exposing (RaceResult)
import Data.ResultCategory exposing (ResultCategory)


type alias Model =
    { result : String
    , category : ResultCategory
    , resultKey : String
    , raceKey : String
    }


initial : String -> Maybe (List RaceResult) -> Maybe Model
initial resultKey maybeResults =
    maybeResults
        |> Maybe.andThen
            (\results ->
                results
                    |> List.filter (\r -> r.key == resultKey)
                    |> List.head
                    |> Maybe.map
                        (\result ->
                            { result = result.result
                            , category = result.category
                            , resultKey = resultKey
                            , raceKey = result.raceKey
                            }
                        )
            )
