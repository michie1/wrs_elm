module Page.Result.Edit.Model exposing (Model, initial)

import Data.RaceResult exposing (RaceResult)

type alias Model =
    { result : String
    , resultKey : String
    , raceKey : String
    }


initial : String -> Maybe (List RaceResult) -> Model
initial resultKey maybeResults =
    case (Debug.log "maybeResults" maybeResults) of
        Just results ->
            let
                maybeResult = List.head <|
                    List.filter
                    (\r -> r.key == resultKey)
                    results
            in
                case maybeResult of
                    Just result ->
                        let
                            _ = Debug.log "hoi" result
                        in
                            { result = result.result
                            , resultKey = resultKey
                            , raceKey = result.raceKey
                            }

                    Nothing ->
                        { result = "asdf"
                        , resultKey = resultKey
                        , raceKey = "1234"
                        }

        Nothing ->
            { result = "1234"
            , resultKey = resultKey
            , raceKey = "1234"
            }
