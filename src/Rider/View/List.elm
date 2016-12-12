module Rider.View.List exposing (render)

import Html exposing (Html, a, div, text, span, input, ul, li, table, td, tr, th, thead, tbody)
import Html.Attributes exposing (href)
import Rider.Model exposing (Rider)
import App.Model
import App.Routing
import App.Msg


render : List Rider -> Html App.Msg.Msg
render riders =
    table []
        [ thead []
            [ tr []
                [ th [] [ text "Name" ]
                , th [] [ text "Licence" ]
                ]
            ]
        , tbody []
            (List.map
                (\rider ->
                    tr []
                        [ td []
                            [ a [ href ("#riders/" ++ (toString rider.id)) ]
                                [ text rider.name ]
                            ]
                        , td [] [ text (toString rider.licence) ]
                        ]
                )
                riders
            )
        ]
