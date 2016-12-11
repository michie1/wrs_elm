module Rider.List exposing (render)

import Html exposing (Html, a, div, text, span, input, ul, li, table, td, tr, th, thead, tbody)
import Html.Attributes exposing (href)
import Rider.Model exposing (Rider)
import App.Model
import App.Routing
import App.Msg


render : List Rider -> Html App.Msg.Msg
render riders =
    div []
        [ riderTable riders
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
