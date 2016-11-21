module Riders.List exposing (render)

import Html exposing (Html, a, div, text, span, input, ul, li, table, td, tr, th, thead, tbody)
import Html.Attributes exposing (href)
import Riders.Model exposing (Rider)
--import Material.Button as Button
--import Material.Options as Options exposing (css)
--import Material.Typography as Typo
--import Material.Table as Table
import App.Model
import App.Routing
import App.Msg

{--
heading : String -> Html App.Msg.Msg
heading title =
      Options.styled
        Html.p
        [ Typo.display2 ]
        [ text title ]
--}

render : List Rider -> Html App.Msg.Msg
render riders =
    div []
        [ --heading "Riders"
        {--, div []
            [ Button.render App.Msg.Mdl
                [ 0 ]
                mdl
                [ Button.raised
                , Button.onClick (App.Msg.GoTo App.Page.RidersAdd)
                ]
                [ text "Add"
                ]
            ]
        --}
         riderTable riders
        ]


riderTable : List Rider -> Html msg
riderTable riders =
    table []
        [ thead []
            [ tr []
                [ th [] [ text "Naam" ]
                , th [] [ text "Licentie" ]
                ]
            ]
        , tbody []
            (riders
                |> List.map
                    (\rider ->
                        tr []
                            [ td []
                                [ a
                                    [ href ("#riders/" ++ (toString rider.id)) ]
                                    [ text rider.name ]
                                ]
                            , td [] [ text (toString rider.licence) ]
                            ]
                    )
            )
        ]
