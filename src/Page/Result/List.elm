module Page.Result.List exposing (view)

import App.Msg
import Data.RaceResult exposing (RaceResult)
import Html exposing (Html, div, table, tbody, td, text, th, thead, tr)


view : Maybe (List RaceResult) -> Html App.Msg.Msg
view maybeResults =
    case maybeResults of
        Nothing ->
            div [] [ text "No results loaded" ]

        Just results ->
            resultsTable results


resultsTable : List RaceResult -> Html msg
resultsTable results =
    table [ class "table" ]
        [ thead []
            [ tr []
                [ th [] [ text "key" ]
                , th [] [ text "raceKey" ]
                , th [] [ text "riderKey" ]
                , th [] [ text "Result" ]
                ]
            ]
        , tbody []
            (results
                |> List.map
                    (\result ->
                        tr []
                            [ td [] [ text result.key ]
                            , td [] [ text (toString result.raceKey) ]
                            , td [] [ text (toString result.riderKey) ]
                            , td [] [ text result.result ]
                            ]
                    )
            )
        ]
