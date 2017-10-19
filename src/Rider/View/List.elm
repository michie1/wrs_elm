module Rider.View.List exposing (render)

import Html exposing (Html, h2, a, div, text, span, input, ul, li, table, td, tr, th, thead, tbody)
import Html.Attributes exposing (href, class)
import Rider.Model exposing (Rider)
import App.Model
import App.Routing
import App.Msg
import Result.Model
import App.Helpers
import Race.Model

render : List Rider -> Html App.Msg.Msg
render riders =
    div []
        [ h2 [] [ text "Riders" ]
        , addButton
        , table []
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
                                [ a [ href ("#riders/" ++ rider.key) ]
                                    [ text rider.name ]
                                ]
                            , td [] [ text (toString rider.licence) ]
                            --, td [] [ text <| toString <| App.Helpers.getPointsByRiderId rider.id results races ]
                            --, td [] [ text <| toString <| countResultsByRiderId rider.id results ]
                            , td [] [ text "points" ]
                            , td [] [ text "races" ]
                            ]
                    )
                    riders
                )
            ]
        ]

addButton : Html App.Msg.Msg
addButton =
    div [] [ a [ href "#riders/add", class "waves-effect waves-light btn" ] [ text "Add rider" ] ]

{--
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
--}

countResultsByRiderId : String -> List Result.Model.Result -> Int
countResultsByRiderId riderKey results =
    List.length <|
        List.filter
            (\result -> result.riderKey == riderKey)
            results
