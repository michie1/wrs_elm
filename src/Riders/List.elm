module Riders.List exposing (render)

import Html exposing (Html, a, div, text, span, input, ul, li)
import Html.Attributes exposing (href)
import Riders.Model exposing (Rider)
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


render : List Rider -> App.Model.Mdl -> Html App.Msg.Msg
render riders mdl =
    div []
        [ heading "Riders"
        , div []
            [ Button.render App.Msg.Mdl
                [ 0 ]
                mdl
                [ Button.raised
                , Button.onClick (App.Msg.GoTo App.Page.RidersAdd)
                ]
                [ text "Add"
                ]
            ]
        , riderTable riders
        ]


riderTable : List Rider -> Html msg
riderTable riders =
    Table.table []
        [ Table.thead []
            [ Table.tr []
                [ Table.th [] [ text "Naam" ]
                , Table.th [] [ text "Licentie" ]
                ]
            ]
        , Table.tbody []
            (riders
                |> List.map
                    (\rider ->
                        Table.tr []
                            [ Table.td []
                                [ a
                                    [ href ("#riders/" ++ (toString rider.id)) ]
                                    [ text rider.name ]
                                ]
                            , Table.td [] [ text rider.licence ]
                            ]
                    )
            )
        ]
