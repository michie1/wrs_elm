module Results.List exposing (render)

import Html exposing (Html, a, div, text, span, input, ul, li)
import Html.Attributes exposing (href)
import Results.Model
import Material
import Material.Scheme
import Material.Button as Button
import Material.Options as Options exposing (css)
import Material.Typography as Typo
import Material.Table as Table

import App.Model
import App.Page
import App.Msg

heading : String -> Html App.Msg.Msg
heading title =
    Options.styled 
        Html.p
        [ Typo.display2 ]
        [ text title ]

render : List Results.Model.Result -> App.Model.Mdl -> Html App.Msg.Msg
render results mdl =
    div []
        [ heading "Results"
        , div []
            [ Button.render App.Msg.Mdl
                [ 0 ]
                mdl
                [ Button.raised
                , Button.onClick (App.Msg.GoTo App.Page.ResultsAdd)
                ]
                [ text "Add"
                ]
            ]
        , resultsTable results
        ]

resultsTable : List Results.Model.Result -> Html msg
resultsTable results =
    Table.table []
        [ Table.thead []
            [ Table.tr []
                [ Table.th [] [ text "id" ]
                , Table.th [] [ text "raceId" ]
                , Table.th [] [ text "riderId" ]
                , Table.th [] [ text "Result" ]
                ]
            ]
        , Table.tbody []
            (results
                |> List.map
                    (\result ->
                        Table.tr []
                            [ Table.td [] [ text (toString result.id) ]
                            , Table.td [] [ text (toString result.raceId) ]
                            , Table.td [] [ text (toString result.riderId) ]
                            , Table.td [] [ text result.result ]
                            ]
                    )
            )
        ]
