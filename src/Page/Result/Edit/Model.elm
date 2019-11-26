module Page.Result.Edit.Model exposing (Model, initial)

import Data.RaceResult exposing (RaceResult)
import Data.ResultCategory as ResultCategory exposing (ResultCategory)


type alias Model =
    { result : String
    , category : ResultCategory
    , resultKey : String
    , raceKey : String
    }


initial : String -> Maybe (List RaceResult) -> Maybe Model
initial resultKey maybeResults =
    case maybeResults of
        Just results ->
            let
                maybeResult =
                    List.head <|
                        List.filter
                            (\r -> r.key == resultKey)
                            results
            in
            case maybeResult of
                Just result ->
                    Just
                        { result = result.result
                        , category = result.category
                        , resultKey = resultKey
                        , raceKey = result.raceKey
                        }

                Nothing ->
                    Nothing

        Nothing ->
            Nothing
