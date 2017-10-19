module Result.View.List exposing (render)

import Html exposing (Html, a, div, text, span, input, ul, li, table, tr, td, tbody, th, thead)
import Result.Model
import App.Model
import App.Msg


render : List Result.Model.Result -> Html App.Msg.Msg
render results =
    div []
        [ resultsTable results
        ]


resultsTable : List Result.Model.Result -> Html msg
resultsTable results =
    table []
        [ thead []
            [ tr []
                [ th [] [ text "id" ]
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
                            [ td [] [ text (toString result.id) ]
                            , td [] [ text (toString result.raceKey) ]
                            , td [] [ text (toString result.riderKey) ]
                            , td [] [ text result.result ]
                            ]
                    )
            )
        ]
