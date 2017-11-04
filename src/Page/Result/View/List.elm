module Page.Result.View.List exposing (render)

import Html exposing (Html, a, div, text, span, input, ul, li, table, tr, td, tbody, th, thead)
import App.Model
import App.Msg
import Data.RaceResult exposing (RaceResult)


render : Maybe (List RaceResult) -> Html App.Msg.Msg
render maybeResults =
    case maybeResults of
        Nothing ->
            div [] [ text "No results loaded" ]

        Just results ->
            resultsTable results


resultsTable : List RaceResult -> Html msg
resultsTable results =
    table []
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
