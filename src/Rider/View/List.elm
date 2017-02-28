module Rider.View.List exposing (render)

import Html exposing (Html, a, div, text, span, input, ul, li, table, td, tr, th, thead, tbody)
import Html.Attributes exposing (href)
import Rider.Model exposing (Rider)
import App.Model
import App.Routing
import App.Msg
import Result.Model
import App.Helpers
import Race.Model

render : List Rider -> List Result.Model.Result -> List Race.Model.Race -> Html App.Msg.Msg
render riders results races =
    table []
        [ thead []
            [ tr []
                [ th [] [ text "Name" ]
                , th [] [ text "Licence" ]
                , th [] [ text "Points" ]
                , th [] [ text "Races" ]
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
                        , td [] [ text <| toString <| App.Helpers.getPointsByRiderId rider.id results races ]
                        , td [] [ text <| toString <| countResultsByRiderId rider.id results ]
                        ]
                )
                riders
            )
        ]

countResultsByRiderId : Int -> List Result.Model.Result -> Int
countResultsByRiderId riderId results =
    List.length <|
        List.filter 
            (\result -> result.riderId == riderId)
            results
